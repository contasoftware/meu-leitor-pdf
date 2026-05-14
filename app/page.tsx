"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

// Visualizador de PDF
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Drag and Drop (DND Kit)
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';

// Importe o componente que criamos
import { SortableTab } from '@/components/SortableTab';

export default function ReaderPage() {
  const tabsFromDb = useLiveQuery(() => db.tabs.toArray());
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const defaultLayoutPluginInstance: any = defaultLayoutPlugin();

  // Sincroniza o estado local com o Banco de Dados
  useEffect(() => {
    if (tabsFromDb) setTabs(tabsFromDb);
  }, [tabsFromDb]);

  // Sensores para Mobile e Desktop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  useEffect(() => {
    const loadPdf = async () => {
      if (activeTabId) {
        const tab = await db.tabs.get(activeTabId);
        if (tab) {
          const url = URL.createObjectURL(tab.fileBlob);
          setPdfUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      } else {
        setPdfUrl(null);
      }
    };
    loadPdf();
  }, [activeTabId]);

  // Função ao soltar a aba reordenada
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      // Dica: Se quiser salvar a ordem no banco, precisaria de um campo 'pos' no DB.
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf") {
        const id = await db.tabs.add({ name: file.name, fileBlob: file, active: 0 });
        setActiveTabId(id as number);
      }
    }
  };

  const closeTab = async (id: number) => {
    await db.tabs.delete(id);
    if (activeTabId === id) setActiveTabId(null);
  };

  return (
    <main className="flex flex-col h-screen w-full bg-white overflow-hidden">

      {/* HEADER COM DND */}
      <div className="flex items-center overflow-x-auto bg-slate-50 border-b border-slate-200 px-2 pt-2 gap-1 no-scrollbar flex-shrink-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tabs.map(t => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  activeTabId={activeTabId}
                  setActiveTabId={setActiveTabId}
                  closeTab={closeTab}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <label className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 mb-2 ml-2 cursor-pointer shadow-sm transition-colors shrink-0">
          <span className="text-xs font-bold">+ Abrir</span>
          <input type="file" accept="application/pdf" multiple hidden onChange={handleFileChange} />
        </label>
      </div>

      {/* VISUALIZADOR */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden">
        {pdfUrl ? (
          <div className="h-full w-full">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} defaultScale={SpecialZoomLevel.PageWidth} />
            </Worker>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Nenhum PDF selecionado
          </div>
        )}
      </div>
    </main>
  );
}
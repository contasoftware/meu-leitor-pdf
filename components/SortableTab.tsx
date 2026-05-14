// src/components/SortableTab.tsx
"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TabProps {
    tab: { id: number; name: string };
    activeTabId: number | null;
    setActiveTabId: (id: number) => void;
    closeTab: (id: number) => void;
}

export function SortableTab({ tab, activeTabId, setActiveTabId, closeTab }: TabProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center min-w-[140px] max-w-[200px] px-4 py-2 rounded-t-lg cursor-grab active:cursor-grabbing transition-all border-t border-x ${activeTabId === tab.id
                ? 'bg-white border-slate-200 text-blue-600 font-bold -mb-[1px] z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'
                : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'
                }`}
        >
            <span className="text-xs truncate flex-1 select-none pointer-events-none">
                {tab.name}
            </span>

            {/* Botão de fechar - Usamos onPointerDown para o DND não "sequestrar" o clique */}
            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                }}
                className="ml-2 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
            >
                ✕
            </button>
        </div>
    );
}
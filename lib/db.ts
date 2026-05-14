// src/lib/db.ts
import Dexie, { Table } from 'dexie';

export interface PDFTab {
    id?: number;
    name: string;
    fileBlob: Blob; // O arquivo PDF real
    active: number; // 1 para ativa, 0 para inativa
}

export class MyDatabase extends Dexie {
    tabs!: Table<PDFTab>;

    constructor() {
        super('PDFReaderDB');
        this.version(1).stores({
            tabs: '++id, name, active' // 'id' é a chave primária automática
        });
    }
}

export const db = new MyDatabase();
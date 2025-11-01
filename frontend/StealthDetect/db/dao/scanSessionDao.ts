// Imports
import { SQLResultSet, SQLTransaction } from "expo-sqlite";
import { db } from "../db";


// ---------- TypeScript Model ---------- //

export interface ScanSession {
    scan_id: string;       // uuid
    user_id: string;       // uuid
    started_at: string;    // ISO datetime
    ended_at?: string;     // ISO datetime | null
    mode: string;          // "quick" | "full" | etc.
    status: string;        // "running" | "completed" | "failed"
    app_version: string;
}

// Used when creating a new session (no ended_at yet)
export type NewScanSession = Omit<ScanSession, "ended_at"> & { ended_at?: null };

// ---------- DAO Functions ---------- //

export const ScanSessionDao = {
    createTable: () => {
        return db.execAsync(`
      CREATE TABLE IF NOT EXISTS ScanSession (
        scan_id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        mode TEXT NOT NULL,
        status TEXT NOT NULL,
        app_version TEXT NOT NULL
      );
    `);
    },

    save: async (session: ScanSession | NewScanSession): Promise<void> => {
        const { scan_id, user_id, started_at, ended_at, mode, status, app_version } = session;

        await db.runAsync(
            `INSERT OR REPLACE INTO ScanSession 
      (scan_id, user_id, started_at, ended_at, mode, status, app_version)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [scan_id, user_id, started_at, ended_at ?? null, mode, status, app_version]
        );
    },

    getAll: async (): Promise<ScanSession[]> => {
        const result = await db.getAllAsync<ScanSession>(`SELECT * FROM ScanSession ORDER BY started_at DESC`);
        return result ?? [];
    },

    getById: async (scan_id: string): Promise<ScanSession | null> => {
        const result = await db.getFirstAsync<ScanSession>(
            `SELECT * FROM ScanSession WHERE scan_id = ?`,
            [scan_id]
        );
        return result ?? null;
    },

    updateStatus: async (scan_id: string, status: string, ended_at?: string): Promise<void> => {
        await db.runAsync(
            `UPDATE ScanSession SET status = ?, ended_at = ? WHERE scan_id = ?`,
            [status, ended_at ?? null, scan_id]
        );
    },

    delete: async (scan_id: string): Promise<void> => {
        await db.runAsync(`DELETE FROM ScanSession WHERE scan_id = ?`, [scan_id]);
    }
};
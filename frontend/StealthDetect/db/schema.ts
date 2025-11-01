export const createScanSessionTable = `
    CREATE TABLE IF NOT EXISTS ScanSession (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        results TEXT NOT NULL,
        matches INTEGER DEFAULT 0
    );
;`

export const createIocMatchTable = `
    CREATE TABLE IF NOT EXISTS IOCMatch (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId INTEGER NOT NULL,
        indicator TEXT NOT NULL,
        type TEXT NOT NULL,
        severity REAL,
        FOREIGN KEY (sessionId) REFERENCES ScanSession(id)
    );
`;

export const createUserProfileTable = `
    CREATE TABLE IF NOT EXISTS UserProfile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locale TEXT DEFAULT 'en',
        riskMode TEXT DEFAULT 'normal',
        createdAt TEXT NOT NULL
    );
`;

export const createAuthCredentialTable = `
    CREATE TABLE IF NOT EXISTS AuthCredential (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mainPinHash TEXT NOT NULL,
        duressPinHash TEXT,
        lastAuthAt TEXT
    );
`;
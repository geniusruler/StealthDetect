export const createAllTables = `
-- ===========================
-- User Profile
-- ===========================
CREATE TABLE IF NOT EXISTS UserProfile (
    user_id TEXT PRIMARY KEY,
    locale TEXT DEFAULT 'en',
    risk_mode TEXT DEFAULT 'normal',
    created_at TEXT NOT NULL
);

-- ===========================
-- Authentication Credentials
-- ===========================
CREATE TABLE IF NOT EXISTS AuthCredential (
    credential_id TEXT PRIMARY KEY,
    main_pin_hash TEXT NOT NULL,
    duress_pin_hash TEXT,
    last_auth_at TEXT
);

-- ===========================
-- Scan Sessions
-- ===========================
CREATE TABLE IF NOT EXISTS ScanSession (
    scan_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    mode TEXT NOT NULL,
    status TEXT NOT NULL,
    app_version TEXT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES UserProfile(user_id)
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_scansession_user
    ON ScanSession(user_id);

-- ===========================
-- Reports (summary of scans)
-- ===========================
CREATE TABLE IF NOT EXISTS Report (
    report_id TEXT PRIMARY KEY,
    scan_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    severity TEXT NOT NULL,
    created_at TEXT NOT NULL,

    FOREIGN KEY (scan_id) REFERENCES ScanSession(scan_id)
);

-- Index for faster scan → reports lookup
CREATE INDEX IF NOT EXISTS idx_report_scan
    ON Report(scan_id);

-- ===========================
-- IOC Matches (findings)
-- ===========================
CREATE TABLE IF NOT EXISTS IOCMatch (
    match_id TEXT PRIMARY KEY,
    scan_id TEXT NOT NULL,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    detected_at TEXT NOT NULL,
    confidence REAL,

    FOREIGN KEY (scan_id) REFERENCES ScanSession(scan_id)
);

CREATE INDEX IF NOT EXISTS idx_iocmatch_scan
    ON IOCMatch(scan_id);

-- ===========================
-- Device State Snapshots
-- ===========================
CREATE TABLE IF NOT EXISTS DeviceStateSnapshot (
    snapshot_id TEXT PRIMARY KEY,
    scan_id TEXT NOT NULL,
    battery_level REAL,
    network_type TEXT,
    ip_address TEXT,
    raw_json TEXT,
    created_at TEXT NOT NULL,

    FOREIGN KEY (scan_id) REFERENCES ScanSession(scan_id)
);

CREATE INDEX IF NOT EXISTS idx_snapshot_scan
    ON DeviceStateSnapshot(scan_id);
`;

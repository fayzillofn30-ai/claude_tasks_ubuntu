-- SQLite schema for Orcestor tracking system (TRACKING_MODE=db, DB_ENGINE=sqlite)
-- Yagona haqiqat manbai: scripts/orcestor.py shu faylni sqlite3 orqali ishga tushiradi.
-- Docker shart emas — bitta lokal fayl (orcestor/db/orcestor.db).
--
-- workspace_path: har bir yozuv qaysi loyiha/papkaga tegishli ekanini belgilaydi.
-- Bitta DB (masalan qasddan yoki tasodifan) bir nechta loyiha orasida ulashilsa ham,
-- workspace_path bo'yicha filtrlash orqali loyihalar bir-biriga ARALASHMASLIGI
-- kafolatlanadi. Bitta workspace_path ichida BIR NECHTA agent/sessiya bemalol
-- birga ishlashi mumkin (shu uchun `task claim` atomik mexanizmi bor).

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_path TEXT NOT NULL DEFAULT '',
    session_id TEXT DEFAULT '',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT CHECK(status IN ('TODO', 'PENDING', 'COMPLETED', 'CANCELLED')) DEFAULT 'TODO',
    assigned_to TEXT DEFAULT 'Executer_Agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_path, status);

CREATE TABLE IF NOT EXISTS task_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_path TEXT NOT NULL DEFAULT '',
    task_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS changed_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_path TEXT NOT NULL DEFAULT '',
    task_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    change_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_path TEXT NOT NULL DEFAULT '',
    session_id TEXT NOT NULL,
    project TEXT DEFAULT 'default',
    summary TEXT NOT NULL,
    blockers TEXT DEFAULT '',
    next_steps TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_checkpoints_workspace ON session_checkpoints(workspace_path, id);

-- standing_rules: PRIMARY KEY endi (workspace_path, topic) — turli loyihalar
-- bir xil topic nomidan mustaqil foydalana oladi.
CREATE TABLE IF NOT EXISTS standing_rules (
    workspace_path TEXT NOT NULL DEFAULT '',
    topic TEXT NOT NULL,
    rule TEXT NOT NULL,
    source TEXT DEFAULT 'session',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_path, topic)
);

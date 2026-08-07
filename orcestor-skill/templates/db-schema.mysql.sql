-- MySQL schema for Orcestor tracking system (TRACKING_MODE=db, DB_ENGINE=mysql)
-- Yagona haqiqat manbai: scripts/orcestor.py shu faylni docker exec + mysql client orqali ishga tushiradi.
--
-- workspace_path: har bir yozuv qaysi loyiha/papkaga tegishli ekanini belgilaydi.
-- Bitta DB (masalan qasddan yoki tasodifan) bir nechta loyiha orasida ulashilsa ham,
-- workspace_path bo'yicha filtrlash orqali loyihalar bir-biriga ARALASHMASLIGI
-- kafolatlanadi. Bitta workspace_path ichida BIR NECHTA agent/sessiya bemalol
-- birga ishlashi mumkin (shu uchun `task claim` atomik mexanizmi bor).

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_path VARCHAR(768) NOT NULL DEFAULT '',
    session_id VARCHAR(255) DEFAULT '',
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    assigned_to VARCHAR(100) DEFAULT 'Executer_Agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tasks_status CHECK (status IN ('TODO', 'PENDING', 'COMPLETED', 'CANCELLED')),
    INDEX idx_tasks_workspace (workspace_path(255), status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_path VARCHAR(768) NOT NULL DEFAULT '',
    task_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS changed_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_path VARCHAR(768) NOT NULL DEFAULT '',
    task_id INT NOT NULL,
    file_path TEXT NOT NULL,
    change_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS session_checkpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_path VARCHAR(768) NOT NULL DEFAULT '',
    session_id VARCHAR(255) NOT NULL,
    project VARCHAR(255) DEFAULT 'default',
    summary TEXT NOT NULL,
    blockers TEXT,
    next_steps TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_checkpoints_workspace (workspace_path(255), id)
) ENGINE=InnoDB;

-- standing_rules: PRIMARY KEY endi (workspace_path, topic) — turli loyihalar
-- bir xil topic nomidan mustaqil foydalana oladi. MySQL'da VARCHAR PK uchun
-- aniq uzunlik kerak (TEXT bo'lolmaydi); ikkalasi ham VARCHAR(255) — InnoDB
-- composite PRIMARY KEY uchun umumiy kalit uzunligi chegarasidan (3072 bayt)
-- xavfsiz ichkarida qolish uchun.
CREATE TABLE IF NOT EXISTS standing_rules (
    workspace_path VARCHAR(255) NOT NULL DEFAULT '',
    topic VARCHAR(255) NOT NULL,
    rule TEXT NOT NULL,
    source VARCHAR(255) DEFAULT 'session',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_path, topic)
) ENGINE=InnoDB;

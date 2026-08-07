#!/usr/bin/env python3
"""
Orcestor CLI - Portable Task & Context Management Tool for Claude Code & AI Agents.
Supports SQLite (local file), PostgreSQL (Docker), and MySQL (Docker) database engines.
"""

import os
import sys
import time
import subprocess
import argparse
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"


def load_config():
    """Reads configuration from orcestor/orcestor.config.env with key=value parser."""
    config = {
        "TRACKING_MODE": "file",
        "DB_ENGINE": "sqlite",
        "POSTGRES_CONTAINER_NAME": "orcestor-db",
        "POSTGRES_USER": "orcestor",
        "POSTGRES_DB": "orcestor",
        "POSTGRES_PORT": "55432",
        "POSTGRES_VOLUME_PATH": "./orcestor/db/pgdata",
        "MYSQL_CONTAINER_NAME": "orcestor-db",
        "MYSQL_USER": "orcestor",
        "MYSQL_DATABASE": "orcestor",
        "MYSQL_PASSWORD": "orcestor",
        "MYSQL_PORT": "33060",
        "MYSQL_VOLUME_PATH": "./orcestor/db/mysqldata",
    }
    env_file = Path.cwd() / "orcestor" / "orcestor.config.env"
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    config[key.strip()] = val.strip()
    return config


def get_workspace_path() -> str:
    """
    Joriy loyiha workspace identifikatori — script qaysi papkadan chaqirilgan
    bo'lsa, o'sha (loyiha ildizi, orcestor/ shu yerda joylashgan deb qaraladi).
    MUHIM: bitta DB (masalan Postgres/MySQL konteyner) bir nechta loyiha
    orasida ulashilsa ham, barcha SELECT/INSERT so'rovlar shu qiymat bilan
    filtrlanadi — shu orqali loyihalar bir-biriga aralashib ketmaydi.
    """
    return str(Path.cwd().resolve())


def pg_escape(value):
    """Safely escapes values for PostgreSQL CLI queries."""
    if value is None:
        return "NULL"
    s = str(value).replace("'", "''")
    return f"'{s}'"


def mysql_escape(value):
    """Safely escapes values for MySQL CLI queries."""
    if value is None:
        return "NULL"
    s = str(value).replace("\\", "\\\\").replace("'", "''")
    return f"'{s}'"


def sqlite_escape(value):
    """Safely escapes values for SQLite queries."""
    if value is None:
        return "NULL"
    s = str(value).replace("'", "''")
    return f"'{s}'"


class BaseAdapter:
    def init(self):
        raise NotImplementedError

    def execute(self, sql: str, fetch: bool = False) -> list[dict] | None:
        raise NotImplementedError

    def escape(self, value):
        raise NotImplementedError

    def claim_task(self, workspace_path: str, session_id: str = "") -> dict | None:
        raise NotImplementedError


class SQLiteAdapter(BaseAdapter):
    def __init__(self, config):
        self.config = config
        self.db_dir = Path.cwd() / "orcestor" / "db"
        self.db_path = self.db_dir / "orcestor.db"

    def escape(self, value):
        return sqlite_escape(value)

    def _get_conn(self):
        self.db_dir.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        # Parallel jarayonlar bazani band qilib turganda darhol xato bermasdan,
        # biroz kutib qaytadan urinish uchun (multi-orkestratsiya konfliktini yumshatadi).
        conn.execute("PRAGMA busy_timeout = 5000")
        return conn

    def init(self):
        schema_file = TEMPLATES_DIR / "db-schema.sqlite.sql"
        if not schema_file.exists():
            print(f"Sxema fayli topilmadi: {schema_file}", file=sys.stderr)
            sys.exit(1)
        schema_sql = schema_file.read_text(encoding="utf-8")
        conn = self._get_conn()
        try:
            with conn:
                conn.executescript(schema_sql)
            print(f"✓ Orcestor database initialized in SQLite file '{self.db_path}'.")
        finally:
            conn.close()

    def execute(self, sql: str, fetch: bool = False) -> list[dict] | None:
        conn = self._get_conn()
        try:
            with conn:
                cursor = conn.cursor()
                cursor.execute(sql)
                if fetch:
                    rows = cursor.fetchall()
                    return [dict(row) for row in rows]
                return None
        finally:
            conn.close()

    def claim_task(self, workspace_path: str, session_id: str = "") -> dict | None:
        ws = sqlite_escape(workspace_path)
        sid = sqlite_escape(session_id)
        conn = self._get_conn()
        try:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE tasks SET status='PENDING', updated_at=CURRENT_TIMESTAMP, "
                    f"session_id={sid} "
                    "WHERE id = (SELECT id FROM tasks WHERE status='TODO' "
                    f"AND workspace_path={ws} ORDER BY id ASC LIMIT 1) "
                    "AND status='TODO';"
                )
                if cursor.rowcount > 0:
                    cursor.execute(
                        "SELECT id, title, description FROM tasks "
                        f"WHERE status='PENDING' AND workspace_path={ws} "
                        "ORDER BY updated_at DESC, id DESC LIMIT 1;"
                    )
                    row = cursor.fetchone()
                    return dict(row) if row else None
                return None
        finally:
            conn.close()


class PostgresAdapter(BaseAdapter):
    def __init__(self, config):
        self.config = config
        self.container = config.get("POSTGRES_CONTAINER_NAME", "orcestor-db")
        self.user = config.get("POSTGRES_USER", "orcestor")
        self.db = config.get("POSTGRES_DB", "orcestor")

    def escape(self, value):
        return pg_escape(value)

    def is_running(self):
        try:
            res = subprocess.run(
                ["docker", "ps", "--filter", f"name={self.container}", "--filter", "status=running", "-q"],
                capture_output=True, text=True, check=True
            )
            return bool(res.stdout.strip())
        except Exception:
            return False

    def init(self):
        if not self.is_running():
            compose_file = Path.cwd() / "orcestor" / "docker-compose.yml"
            if not compose_file.exists():
                print(f"Error: {compose_file} fayli topilmadi.", file=sys.stderr)
                sys.exit(1)
            up_res = subprocess.run(["docker", "compose", "-f", str(compose_file), "up", "-d"], capture_output=True, text=True)
            if up_res.returncode != 0:
                print(f"Docker compose error: {up_res.stderr.strip()}", file=sys.stderr)
                sys.exit(1)

        ready = False
        for _ in range(10):
            check_res = subprocess.run(
                ["docker", "exec", self.container, "pg_isready", "-U", self.user],
                capture_output=True, text=True
            )
            if check_res.returncode == 0:
                ready = True
                break
            time.sleep(1)

        if not ready:
            print(f"Error: Postgres container '{self.container}' ready bo'lishini kutish taymaut bo'ldi.", file=sys.stderr)
            sys.exit(1)

        # MUHIM (mavjud konteynerni qayta ishlatish stsenariysi uchun): agar
        # konteyner boshqa loyiha uchun ilgari yaratilgan bo'lsa, POSTGRES_DB
        # o'zgaruvchisi faqat konteyner BIRINCHI marta ishga tushganda amal
        # qiladi — shu sabab bazani qo'lda, mavjud emasligini tekshirib,
        # kerak bo'lsa yaratamiz (Postgres'da "CREATE DATABASE IF NOT EXISTS"
        # yo'q, shu sabab avval tekshirish kerak).
        check_db_cmd = [
            "docker", "exec", "-i", self.container,
            "psql", "-q", "-U", self.user, "-d", "postgres",
            "-tAc", f"SELECT 1 FROM pg_database WHERE datname='{self.db}';"
        ]
        check_res = subprocess.run(check_db_cmd, capture_output=True, text=True)
        if check_res.returncode == 0 and check_res.stdout.strip() != "1":
            create_res = subprocess.run(
                ["docker", "exec", "-i", self.container,
                 "psql", "-q", "-U", self.user, "-d", "postgres",
                 "-c", f'CREATE DATABASE "{self.db}";'],
                capture_output=True, text=True
            )
            if create_res.returncode != 0:
                print(f"Bazani yaratishda xato: {create_res.stderr.strip()}", file=sys.stderr)
                sys.exit(1)
            print(f"✓ '{self.db}' bazasi konteyner ichida yaratildi (mavjud bo'lmagani uchun).")

        schema_file = TEMPLATES_DIR / "db-schema.postgres.sql"
        if not schema_file.exists():
            print(f"Sxema fayli topilmadi: {schema_file}", file=sys.stderr)
            sys.exit(1)

        schema_sql = schema_file.read_text(encoding="utf-8")
        cmd = [
            "docker", "exec", "-i", self.container,
            "psql", "-q", "-U", self.user, "-d", self.db,
            "-v", "ON_ERROR_STOP=1", "-f", "-"
        ]
        res = subprocess.run(cmd, input=schema_sql, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Sxema o'rnatishda xato: {res.stderr.strip()}", file=sys.stderr)
            sys.exit(1)

        print(f"✓ Orcestor database initialized in Postgres container '{self.container}'.")

    def execute(self, sql: str, fetch: bool = False) -> list[dict] | None:
        # MUHIM: "-q" shart — aks holda psql RETURNING/DML natijasidan keyin
        # "UPDATE N" / "INSERT 0 N" kabi buyruq-tegini alohida qator sifatida
        # chiqaradi va bu soxta "ma'lumot qatori" sifatida parse qilinib ketadi
        # (masalan 0 mos qator bo'lganda ham soxta natija qaytishi mumkin edi).
        if fetch:
            cmd = [
                "docker", "exec", "-i", self.container,
                "psql", "-q", "-U", self.user, "-d", self.db,
                "-v", "ON_ERROR_STOP=1",
                "-A", "-F", "|", "-P", "footer=off",
                "-c", sql
            ]
        else:
            cmd = [
                "docker", "exec", "-i", self.container,
                "psql", "-q", "-U", self.user, "-d", self.db,
                "-v", "ON_ERROR_STOP=1",
                "-A", "-t", "-F", "|",
                "-c", sql
            ]

        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"SQL Error: {res.stderr.strip()}", file=sys.stderr)
            sys.exit(1)

        if not fetch:
            return None

        lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
        if not lines:
            return []

        headers = lines[0].split("|")
        results = []
        for line in lines[1:]:
            parts = line.split("|")
            row_dict = {}
            for idx, h in enumerate(headers):
                row_dict[h] = parts[idx] if idx < len(parts) else ""
            results.append(row_dict)
        return results

    def claim_task(self, workspace_path: str, session_id: str = "") -> dict | None:
        ws = pg_escape(workspace_path)
        sid = pg_escape(session_id)
        sql = f"""
        UPDATE tasks SET status='PENDING', updated_at=NOW(), session_id={sid}
        WHERE id = (SELECT id FROM tasks WHERE status='TODO' AND workspace_path={ws}
                    ORDER BY id ASC LIMIT 1 FOR UPDATE SKIP LOCKED)
        RETURNING id, title, description;
        """
        rows = self.execute(sql, fetch=True)
        if rows:
            return rows[0]
        return None


class MySQLAdapter(BaseAdapter):
    def __init__(self, config):
        self.config = config
        self.container = config.get("MYSQL_CONTAINER_NAME", "orcestor-db")
        self.user = config.get("MYSQL_USER", "orcestor")
        self.password = config.get("MYSQL_PASSWORD", "orcestor")
        self.db = config.get("MYSQL_DATABASE", "orcestor")

    def escape(self, value):
        return mysql_escape(value)

    def is_running(self):
        try:
            res = subprocess.run(
                ["docker", "ps", "--filter", f"name={self.container}", "--filter", "status=running", "-q"],
                capture_output=True, text=True, check=True
            )
            return bool(res.stdout.strip())
        except Exception:
            return False

    def init(self):
        if not self.is_running():
            compose_file = Path.cwd() / "orcestor" / "docker-compose.yml"
            if not compose_file.exists():
                print(f"Error: {compose_file} fayli topilmadi.", file=sys.stderr)
                sys.exit(1)
            up_res = subprocess.run(["docker", "compose", "-f", str(compose_file), "up", "-d"], capture_output=True, text=True)
            if up_res.returncode != 0:
                print(f"Docker compose error: {up_res.stderr.strip()}", file=sys.stderr)
                sys.exit(1)

        ready = False
        for _ in range(15):
            check_res = subprocess.run(
                ["docker", "exec", self.container, "mysqladmin", "ping", f"-u{self.user}", f"-p{self.password}"],
                capture_output=True, text=True
            )
            if check_res.returncode == 0:
                ready = True
                break
            time.sleep(1)

        if not ready:
            print(f"Error: MySQL container '{self.container}' ready bo'lishini kutish taymaut bo'ldi.", file=sys.stderr)
            sys.exit(1)

        # MUHIM (mavjud konteynerni qayta ishlatish stsenariysi uchun): agar
        # konteyner boshqa loyiha uchun ilgari yaratilgan bo'lsa, MYSQL_DATABASE
        # o'zgaruvchisi faqat konteyner BIRINCHI marta ishga tushganda amal
        # qiladi — shu sabab bazani (mavjud bo'lmasa) qo'lda yaratamiz.
        create_db_cmd = [
            "docker", "exec", "-i", self.container,
            "mysql", f"-u{self.user}", f"-p{self.password}",
            "-e", f"CREATE DATABASE IF NOT EXISTS `{self.db}`;"
        ]
        create_res = subprocess.run(create_db_cmd, capture_output=True, text=True)
        if create_res.returncode != 0:
            print(f"Bazani yaratishda xato: {create_res.stderr.strip()}", file=sys.stderr)
            sys.exit(1)

        schema_file = TEMPLATES_DIR / "db-schema.mysql.sql"
        if not schema_file.exists():
            print(f"Sxema fayli topilmadi: {schema_file}", file=sys.stderr)
            sys.exit(1)

        schema_sql = schema_file.read_text(encoding="utf-8")
        cmd = [
            "docker", "exec", "-i", self.container,
            "mysql", f"-u{self.user}", f"-p{self.password}", self.db
        ]
        res = subprocess.run(cmd, input=schema_sql, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Sxema o'rnatishda xato: {res.stderr.strip()}", file=sys.stderr)
            sys.exit(1)

        print(f"✓ Orcestor database initialized in MySQL container '{self.container}'.")

    def execute(self, sql: str, fetch: bool = False) -> list[dict] | None:
        cmd = [
            "docker", "exec", "-i", self.container,
            "mysql", f"-u{self.user}", f"-p{self.password}", self.db,
            "-B", "-e", sql
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"SQL Error: {res.stderr.strip()}", file=sys.stderr)
            sys.exit(1)

        if not fetch:
            return None

        lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
        if not lines:
            return []

        headers = lines[0].split("\t")
        results = []
        for line in lines[1:]:
            parts = line.split("\t")
            row_dict = {}
            for idx, h in enumerate(headers):
                row_dict[h] = parts[idx] if idx < len(parts) else ""
            results.append(row_dict)
        return results

    def claim_task(self, workspace_path: str, session_id: str = "") -> dict | None:
        # MUHIM: SELECT...FOR UPDATE va UPDATE bitta docker-exec/mysql-CLI chaqiruvida
        # (bitta ulanish/sessiya) bajarilishi SHART — aks holda tranzaksiya va lock
        # ikkinchi chaqiruvgacha saqlanmaydi va "atomik claim" haqiqatda atomik bo'lmay qoladi.
        ws = mysql_escape(workspace_path)
        sid = mysql_escape(session_id)
        claim_sql = (
            "START TRANSACTION; "
            f"UPDATE tasks SET status='PENDING', updated_at=CURRENT_TIMESTAMP, session_id={sid} "
            "WHERE id = (SELECT id FROM (SELECT id FROM tasks WHERE status='TODO' "
            f"AND workspace_path={ws} "
            "ORDER BY id ASC LIMIT 1 FOR UPDATE SKIP LOCKED) AS t); "
            "SELECT ROW_COUNT() AS affected; "
            "COMMIT;"
        )
        rows = self.execute(claim_sql, fetch=True)
        affected = int(rows[0].get("affected", 0)) if rows else 0
        if affected == 0:
            return None

        # Claim muvaffaqiyatli — ta'sirlangan qatorni faqat ko'rsatish uchun o'qiymiz
        # (bu so'rov claim'ning o'zi bilan bir xil tranzaksiyada bo'lishi shart emas).
        detail_rows = self.execute(
            "SELECT id, title, description FROM tasks "
            f"WHERE status='PENDING' AND workspace_path={ws} "
            "ORDER BY updated_at DESC, id DESC LIMIT 1;",
            fetch=True
        )
        return detail_rows[0] if detail_rows else None


def get_adapter(config):
    engine = config.get("DB_ENGINE", "sqlite").lower()
    if engine == "postgres":
        return PostgresAdapter(config)
    elif engine == "mysql":
        return MySQLAdapter(config)
    else:
        return SQLiteAdapter(config)


def cmd_init(args, config, adapter):
    adapter.init()


def cmd_checkpoint_add(args, config, adapter):
    ws = adapter.escape(get_workspace_path())
    sql = f"""
    INSERT INTO session_checkpoints (workspace_path, session_id, project, summary, blockers, next_steps)
    VALUES ({ws}, {adapter.escape(args.session_id)}, {adapter.escape(args.project)}, {adapter.escape(args.summary)}, {adapter.escape(args.blockers or '')}, {adapter.escape(args.next_steps or '')});
    """
    adapter.execute(sql)
    print("✓ Session checkpoint saved successfully.")


def cmd_checkpoint_get(args, config, adapter):
    ws = adapter.escape(get_workspace_path())
    sql_cp = (
        "SELECT session_id, created_at, summary, blockers, next_steps FROM session_checkpoints "
        f"WHERE workspace_path={ws} ORDER BY id DESC LIMIT 1;"
    )
    rows_cp = adapter.execute(sql_cp, fetch=True)

    if args.topic:
        sql_rules = f"SELECT topic, rule FROM standing_rules WHERE workspace_path={ws} AND topic = {adapter.escape(args.topic)};"
    else:
        sql_rules = f"SELECT topic, rule FROM standing_rules WHERE workspace_path={ws} ORDER BY topic ASC;"
    rows_rules = adapter.execute(sql_rules, fetch=True)

    output = ["=== ORCESTOR CONTEXT CHECKPOINT ==="]
    if rows_cp and len(rows_cp) > 0:
        cp = rows_cp[0]
        output.append(f"Session ID: {cp.get('session_id', '')}")
        output.append(f"Timestamp: {cp.get('created_at', '')}")
        output.append(f"Summary: {cp.get('summary', '')}")
        if cp.get('blockers'):
            output.append(f"Blockers/Tested: {cp.get('blockers')}")
        if cp.get('next_steps'):
            output.append(f"Next Steps: {cp.get('next_steps')}")
    else:
        output.append("No previous checkpoints found.")

    output.append("\n=== STANDING RULES ===")
    if rows_rules and len(rows_rules) > 0:
        for r in rows_rules:
            output.append(f"• [{r.get('topic', '')}]: {r.get('rule', '')}")
    else:
        output.append("No active standing rules.")

    print("\n".join(output))


def cmd_rule_add(args, config, adapter):
    engine = config.get("DB_ENGINE", "sqlite").lower()
    now_fn = "NOW()" if engine == "postgres" else "CURRENT_TIMESTAMP"
    ws = adapter.escape(get_workspace_path())
    if engine == "mysql":
        sql = f"""
        INSERT INTO standing_rules (workspace_path, topic, rule, source, updated_at)
        VALUES ({ws}, {adapter.escape(args.topic)}, {adapter.escape(args.rule)}, {adapter.escape(args.source or 'session')}, {now_fn})
        ON DUPLICATE KEY UPDATE rule=VALUES(rule), source=VALUES(source), updated_at={now_fn};
        """
    else:
        sql = f"""
        INSERT INTO standing_rules (workspace_path, topic, rule, source, updated_at)
        VALUES ({ws}, {adapter.escape(args.topic)}, {adapter.escape(args.rule)}, {adapter.escape(args.source or 'session')}, {now_fn})
        ON CONFLICT (workspace_path, topic) DO UPDATE SET rule=EXCLUDED.rule, source=EXCLUDED.source, updated_at={now_fn};
        """
    adapter.execute(sql)
    print(f"✓ Standing rule for topic '{args.topic}' upserted successfully.")


def cmd_rule_list(args, config, adapter):
    ws = adapter.escape(get_workspace_path())
    sql = f"SELECT topic, rule, source, updated_at FROM standing_rules WHERE workspace_path={ws} ORDER BY topic ASC;"
    rows = adapter.execute(sql, fetch=True)
    if not rows:
        print("No standing rules found.")
        return

    print("=== STANDING RULES ===")
    for r in rows:
        print(f"[{r.get('topic', '')}] ({r.get('updated_at', '')})\n  Rule: {r.get('rule', '')}\n  Source: {r.get('source', '')}\n")


def cmd_task_create(args, config, adapter):
    engine = config.get("DB_ENGINE", "sqlite").lower()
    ws = adapter.escape(get_workspace_path())
    sid = adapter.escape(getattr(args, "session_id", "") or "")
    if engine == "mysql":
        sql = f"""
        INSERT INTO tasks (workspace_path, session_id, title, description, status)
        VALUES ({ws}, {sid}, {adapter.escape(args.title)}, {adapter.escape(args.description or '')}, 'TODO');
        SELECT LAST_INSERT_ID() AS id;
        """
        rows = adapter.execute(sql, fetch=True)
        task_id = rows[0].get("id") if rows else "N/A"
    else:
        sql = f"""
        INSERT INTO tasks (workspace_path, session_id, title, description, status)
        VALUES ({ws}, {sid}, {adapter.escape(args.title)}, {adapter.escape(args.description or '')}, 'TODO')
        RETURNING id;
        """
        rows = adapter.execute(sql, fetch=True)
        task_id = rows[0].get("id") if rows else "N/A"

    print(f"✓ Task #{task_id} created with status 'TODO'.")


def cmd_task_claim(args, config, adapter):
    workspace_path = get_workspace_path()
    session_id = getattr(args, "session_id", "") or ""
    task = adapter.claim_task(workspace_path, session_id)
    if not task:
        print("Hozircha TODO holatida task yo'q.")
    else:
        task_id = task.get("id", "")
        title = task.get("title", "")
        desc = task.get("description", "")
        print(f"✓ Task #{task_id} claimed: '{title}'")
        if desc:
            print(f"   Description: {desc}")


def cmd_task_update(args, config, adapter):
    engine = config.get("DB_ENGINE", "sqlite").lower()
    now_fn = "NOW()" if engine == "postgres" else "CURRENT_TIMESTAMP"
    ws = adapter.escape(get_workspace_path())
    sql = f"""
    UPDATE tasks SET status = {adapter.escape(args.status)}, updated_at = {now_fn}
    WHERE id = {int(args.id)} AND workspace_path = {ws};
    """
    adapter.execute(sql)
    print(f"✓ Task #{args.id} status updated to '{args.status}'.")


def cmd_task_list(args, config, adapter):
    ws = adapter.escape(get_workspace_path())
    if args.status:
        sql = (
            "SELECT id, title, description, status, updated_at FROM tasks "
            f"WHERE workspace_path={ws} AND status = {adapter.escape(args.status)} ORDER BY id ASC;"
        )
    else:
        sql = f"SELECT id, title, description, status, updated_at FROM tasks WHERE workspace_path={ws} ORDER BY id ASC;"

    rows = adapter.execute(sql, fetch=True)
    if not rows:
        print("No tasks found.")
        return

    print("=== TASKS ===")
    for r in rows:
        print(f"#{r.get('id', '')} [{r.get('status', '')}] {r.get('title', '')}")
        if r.get("description"):
            print(f"   Description: {r.get('description')}")


def cmd_status(args, config, adapter):
    ws = adapter.escape(get_workspace_path())
    sql = f"""
    SELECT
      (SELECT COUNT(*) FROM tasks WHERE workspace_path={ws} AND status = 'TODO') as todo_cnt,
      (SELECT COUNT(*) FROM tasks WHERE workspace_path={ws} AND status = 'PENDING') as pending_cnt,
      (SELECT COUNT(*) FROM tasks WHERE workspace_path={ws} AND status = 'COMPLETED') as completed_cnt,
      (SELECT COUNT(*) FROM standing_rules WHERE workspace_path={ws}) as rules_cnt;
    """
    rows = adapter.execute(sql, fetch=True)
    if rows and len(rows) > 0:
        r = rows[0]
        todo_cnt = r.get("todo_cnt", "0")
        pending_cnt = r.get("pending_cnt", "0")
        completed_cnt = r.get("completed_cnt", "0")
        rules_cnt = r.get("rules_cnt", "0")
    else:
        todo_cnt = pending_cnt = completed_cnt = rules_cnt = "0"

    sql_cp = f"SELECT session_id, created_at, summary FROM session_checkpoints WHERE workspace_path={ws} ORDER BY id DESC LIMIT 1;"
    rows_cp = adapter.execute(sql_cp, fetch=True)

    print("=== ORCESTOR SYSTEM STATUS ===")
    print(f"Tasks: TODO ({todo_cnt}) | PENDING ({pending_cnt}) | COMPLETED ({completed_cnt})")
    print(f"Active Standing Rules: {rules_cnt}")
    if rows_cp and len(rows_cp) > 0:
        cp = rows_cp[0]
        print(f"Last Session: {cp.get('session_id', '')} at {cp.get('created_at', '')}")
        print(f"Last Summary: {cp.get('summary', '')}")
    else:
        print("Last Session: None")


def main():
    parser = argparse.ArgumentParser(description="Orcestor CLI - Portable AI Task & Context Manager")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # init
    parser_init = subparsers.add_parser("init", help="Initialize Orcestor database & schema")
    parser_init.set_defaults(func=cmd_init)

    # checkpoint
    parser_cp = subparsers.add_parser("checkpoint", help="Manage session checkpoints")
    cp_sub = parser_cp.add_subparsers(dest="cp_command")

    cp_add = cp_sub.add_parser("add", help="Add new session checkpoint")
    cp_add.add_argument("--session-id", required=True, help="Session identifier")
    cp_add.add_argument("--summary", required=True, help="Short summary of work completed (~200-400 tokens)")
    cp_add.add_argument("--blockers", help="Tested items & rejected hypotheses")
    cp_add.add_argument("--next-steps", help="Next immediate actions")
    cp_add.add_argument("--project", default="default", help="Project name")
    cp_add.set_defaults(func=cmd_checkpoint_add)

    cp_get = cp_sub.add_parser("get", help="Get compact context for new session startup")
    cp_get.add_argument("--topic", help="Filter standing rules by topic")
    cp_get.set_defaults(func=cmd_checkpoint_get)

    # rule
    parser_rule = subparsers.add_parser("rule", help="Manage standing rules")
    rule_sub = parser_rule.add_subparsers(dest="rule_command")

    rule_add = rule_sub.add_parser("add", help="Add or update standing rule")
    rule_add.add_argument("--topic", required=True, help="Topic identifier (unique key)")
    rule_add.add_argument("--rule", required=True, help="Standing rule description")
    rule_add.add_argument("--source", help="Source session or note")
    rule_add.set_defaults(func=cmd_rule_add)

    rule_list = rule_sub.add_parser("list", help="List all standing rules")
    rule_list.set_defaults(func=cmd_rule_list)

    # task
    parser_task = subparsers.add_parser("task", help="Manage tasks")
    task_sub = parser_task.add_subparsers(dest="task_command")

    task_create = task_sub.add_parser("create", help="Create new task")
    task_create.add_argument("--title", required=True, help="Task title")
    task_create.add_argument("--description", help="Task details")
    task_create.add_argument("--session-id", help="Optional: which session created this (audit only)")
    task_create.set_defaults(func=cmd_task_create)

    task_claim = task_sub.add_parser("claim", help="Claim next available TODO task atomically (scoped to current workspace)")
    task_claim.add_argument("--session-id", help="Optional: which session claimed this (audit only)")
    task_claim.set_defaults(func=cmd_task_claim)

    task_update = task_sub.add_parser("update", help="Update task status")
    task_update.add_argument("--id", type=int, required=True, help="Task ID")
    task_update.add_argument("--status", choices=['TODO', 'PENDING', 'COMPLETED', 'CANCELLED'], required=True, help="New status")
    task_update.set_defaults(func=cmd_task_update)

    task_list = task_sub.add_parser("list", help="List tasks")
    task_list.add_argument("--status", choices=['TODO', 'PENDING', 'COMPLETED', 'CANCELLED'], help="Filter by status")
    task_list.set_defaults(func=cmd_task_list)

    # status
    parser_status = subparsers.add_parser("status", help="Get summary status of Orcestor state")
    parser_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    if not hasattr(args, 'func'):
        parser.print_help()
        return

    config = load_config()
    adapter = get_adapter(config)

    if args.command != "init":
        engine = config.get("DB_ENGINE", "sqlite").lower()
        if engine in ("postgres", "mysql"):
            if hasattr(adapter, "is_running") and not adapter.is_running():
                print(f"{engine.upper()} konteyner ishlamayapti. Avval: python3 scripts/orcestor.py init")
                sys.exit(1)

    args.func(args, config, adapter)


if __name__ == "__main__":
    main()

-- StudySync database schema (SQLite).
-- Safe to run more than once: every statement uses IF NOT EXISTS.
-- Dates are stored as ISO 8601 text; created_at columns use UTC.

CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash   TEXT NOT NULL,
  university      TEXT,
  course_of_study TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  sid        TEXT PRIMARY KEY,
  data       TEXT NOT NULL,
  expires_at INTEGER NOT NULL            -- milliseconds since 1970
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS user_settings (
  id                         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id                    INTEGER NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  pomodoro_focus_min         INTEGER NOT NULL DEFAULT 25 CHECK (pomodoro_focus_min > 0),
  pomodoro_short_break_min   INTEGER NOT NULL DEFAULT 5  CHECK (pomodoro_short_break_min > 0),
  pomodoro_long_break_min    INTEGER NOT NULL DEFAULT 15 CHECK (pomodoro_long_break_min > 0),
  sessions_before_long_break INTEGER NOT NULL DEFAULT 4  CHECK (sessions_before_long_break > 0),
  sound_enabled              INTEGER NOT NULL DEFAULT 1  CHECK (sound_enabled IN (0, 1)),
  default_reminder_hours     INTEGER NOT NULL DEFAULT 24 CHECK (default_reminder_hours >= 0)
);

CREATE TABLE IF NOT EXISTS semesters (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  start_date TEXT,
  end_date   TEXT,
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  semester_id  INTEGER REFERENCES semesters (id) ON DELETE SET NULL,
  code         TEXT,
  name         TEXT NOT NULL,
  colour       TEXT,
  credit_hours REAL CHECK (credit_hours IS NULL OR credit_hours > 0)
);
CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects (user_id);

CREATE TABLE IF NOT EXISTS assignments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id   INTEGER REFERENCES subjects (id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  deadline     TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status       TEXT NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TEXT,
  reminder_at  TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_assignments_user_deadline ON assignments (user_id, deadline);

CREATE TABLE IF NOT EXISTS examinations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  INTEGER REFERENCES subjects (id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  exam_date   TEXT NOT NULL,
  start_time  TEXT,
  end_time    TEXT,
  location    TEXT,
  notes       TEXT,
  reminder_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_examinations_user_date ON examinations (user_id, exam_date);

CREATE TABLE IF NOT EXISTS timetable (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  INTEGER REFERENCES subjects (id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),  -- 1 = Monday
  start_time  TEXT NOT NULL,                                          -- "HH:MM"
  end_time    TEXT NOT NULL,
  lecturer    TEXT,
  location    TEXT,
  CHECK (end_time > start_time)
);
CREATE INDEX IF NOT EXISTS idx_timetable_user_day ON timetable (user_id, day_of_week);

CREATE TABLE IF NOT EXISTS study_sessions (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id       INTEGER REFERENCES subjects (id) ON DELETE SET NULL,
  session_type     TEXT NOT NULL DEFAULT 'focus'
                   CHECK (session_type IN ('focus', 'short_break', 'long_break')),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  started_at       TEXT NOT NULL,
  ended_at         TEXT NOT NULL,
  notes            TEXT
);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_started ON study_sessions (user_id, started_at);

CREATE TABLE IF NOT EXISTS grade_scales (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  grade       TEXT NOT NULL,
  grade_point REAL NOT NULL CHECK (grade_point >= 0),
  UNIQUE (user_id, grade)
);

CREATE TABLE IF NOT EXISTS grades (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  semester_id  INTEGER NOT NULL REFERENCES semesters (id) ON DELETE CASCADE,
  subject_id   INTEGER REFERENCES subjects (id) ON DELETE SET NULL,
  course_name  TEXT NOT NULL,
  credit_hours REAL NOT NULL CHECK (credit_hours > 0),
  grade        TEXT NOT NULL,
  grade_point  REAL NOT NULL CHECK (grade_point >= 0)   -- copied from the scale when saved
);
CREATE INDEX IF NOT EXISTS idx_grades_user_semester ON grades (user_id, semester_id);

CREATE TABLE IF NOT EXISTS events (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  start_datetime TEXT NOT NULL,
  end_datetime   TEXT,
  all_day        INTEGER NOT NULL DEFAULT 0 CHECK (all_day IN (0, 1)),
  category       TEXT NOT NULL DEFAULT 'personal'
);
CREATE INDEX IF NOT EXISTS idx_events_user_start ON events (user_id, start_datetime);

CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('assignment', 'exam', 'event')),
  ref_id     INTEGER NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT,
  due_at     TEXT NOT NULL,
  is_read    INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, type, ref_id, due_at)               -- stops duplicate reminders
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read);
import initSqlJs from "sql.js";

class Database {
   constructor() {
      this.db = null;
      this.initialized = false;
   }

   async init() {
      if (this.initialized) return;

      try {
         const SQL = await initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`,
         });

         // Try to load existing database from localStorage
         const savedDb = localStorage.getItem("ontime_database");

         if (savedDb) {
            const uint8Array = new Uint8Array(JSON.parse(savedDb));
            this.db = new SQL.Database(uint8Array);
         } else {
            this.db = new SQL.Database();
            this.createTables();
            this.migrateFromLocalStorage();
         }

         this.initialized = true;
         console.log("Database initialized successfully");
      } catch (error) {
         console.error("Failed to initialize database:", error);
         throw error;
      }
   }

   createTables() {
      // Tasks table
      this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pomo_total INTEGER NOT NULL,
        pomo_done INTEGER DEFAULT 0,
        mode TEXT CHECK(mode IN ('standard', 'study')) DEFAULT 'standard',
        subject TEXT,
        specific_topic TEXT,
        subtopics TEXT,
        study_notes TEXT,
        quizzes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

      // Quiz results table
      this.db.run(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        subject TEXT,
        topic TEXT,
        total_questions INTEGER,
        correct_answers INTEGER,
        score REAL,
        attempt_number INTEGER DEFAULT 1,
        answers_data TEXT,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      )
    `);

      // Sessions table (migrated from localStorage ontime_sessions)
      this.db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        mode TEXT,
        subject TEXT,
        duration INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      )
    `);

      // Stats table (migrated from localStorage ontime_stats)
      this.db.run(`
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        total_pomodoros INTEGER DEFAULT 0,
        total_hours REAL DEFAULT 0,
        study_sessions INTEGER DEFAULT 0,
        standard_sessions INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

      // Initialize stats row
      this.db.run(`
      INSERT OR IGNORE INTO stats (id, total_pomodoros, total_hours, study_sessions, standard_sessions)
      VALUES (1, 0, 0, 0, 0)
    `);

      this.save();
   }

   migrateFromLocalStorage() {
      try {
         // Migrate tasks from myTODOs
         const tasks = JSON.parse(localStorage.getItem("myTODOs") || "[]");
         tasks.forEach((task) => {
            this.addTask({
               name: task.name,
               pomoTotal: task.pomoTotal,
               pomoDone: task.pomoDone || 0,
               mode: task.mode || "standard",
               subject: task.subject || null,
               specificTopic: task.specificTopic || null,
               subtopics: task.subtopics || [],
               studyNotes: task.studyNotes || [],
               quizzes: task.quizzes || [],
            });
         });

         // Migrate sessions
         const sessions = JSON.parse(
            localStorage.getItem("ontime_sessions") || "[]",
         );
         sessions.forEach((session) => {
            this.db.run(
               `
          INSERT INTO sessions (mode, subject, duration, completed_at)
          VALUES (?, ?, ?, ?)
        `,
               [
                  session.mode || "standard",
                  session.subject || null,
                  session.duration || 25,
                  session.timestamp,
               ],
            );
         });

         // Migrate stats
         const stats = JSON.parse(localStorage.getItem("ontime_stats") || "{}");
         if (Object.keys(stats).length > 0) {
            this.db.run(
               `
          UPDATE stats SET
            total_pomodoros = ?,
            total_hours = ?,
            study_sessions = ?,
            standard_sessions = ?
          WHERE id = 1
        `,
               [
                  stats.totalPomodoros || 0,
                  stats.totalHours || 0,
                  stats.studySessions || 0,
                  stats.standardSessions || 0,
               ],
            );
         }

         this.save();
         console.log("Successfully migrated data from localStorage");
      } catch (error) {
         console.error("Migration error:", error);
      }
   }

   save() {
      if (!this.db) return;

      try {
         const data = this.db.export();
         const buffer = Array.from(data);
         localStorage.setItem("ontime_database", JSON.stringify(buffer));
      } catch (error) {
         console.error("Failed to save database:", error);
      }
   }

   // Task operations
   addTask(task) {
      const stmt = this.db.prepare(`
      INSERT INTO tasks (name, pomo_total, pomo_done, mode, subject, specific_topic, subtopics, study_notes, quizzes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

      stmt.run([
         task.name,
         task.pomoTotal,
         task.pomoDone || 0,
         task.mode || "standard",
         task.subject || null,
         task.specificTopic || null,
         JSON.stringify(task.subtopics || []),
         JSON.stringify(task.studyNotes || []),
         JSON.stringify(task.quizzes || []),
      ]);

      stmt.free();
      this.save();

      return this.db.exec("SELECT last_insert_rowid()")[0].values[0][0];
   }

   getAllTasks() {
      if (!this.db) return [];

      const results = this.db.exec("SELECT * FROM tasks ORDER BY id");

      if (!results.length) return [];

      const columns = results[0].columns;
      const rows = results[0].values;

      return rows.map((row) => {
         const task = {};
         columns.forEach((col, idx) => {
            task[col] = row[idx];
         });

         // Parse JSON fields
         if (task.subtopics) task.subtopics = JSON.parse(task.subtopics);
         if (task.study_notes) task.study_notes = JSON.parse(task.study_notes);
         if (task.quizzes) task.quizzes = JSON.parse(task.quizzes);

         return task;
      });
   }

   getTask(id) {
      if (!this.db) return null;

      const stmt = this.db.prepare("SELECT * FROM tasks WHERE id = ?");
      stmt.bind([id]);

      if (stmt.step()) {
         const task = stmt.getAsObject();
         stmt.free();

         if (task.subtopics) task.subtopics = JSON.parse(task.subtopics);
         if (task.study_notes) task.study_notes = JSON.parse(task.study_notes);
         if (task.quizzes) task.quizzes = JSON.parse(task.quizzes);

         return task;
      }

      stmt.free();
      return null;
   }

   updateTask(id, updates) {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach((key) => {
         const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
         fields.push(`${dbKey} = ?`);

         if (["subtopics", "study_notes", "quizzes"].includes(dbKey)) {
            values.push(JSON.stringify(updates[key]));
         } else {
            values.push(updates[key]);
         }
      });

      if (fields.length === 0) return;

      values.push(id);
      this.db.run(
         `
      UPDATE tasks SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
         values,
      );

      this.save();
   }

   deleteTask(id) {
      this.db.run("DELETE FROM tasks WHERE id = ?", [id]);
      this.save();
   }

   // Quiz results operations
   saveQuizResult(result) {
      const stmt = this.db.prepare(`
      INSERT INTO quiz_results (task_id, subject, topic, total_questions, correct_answers, score, attempt_number, answers_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

      stmt.run([
         result.taskId,
         result.subject,
         result.topic,
         result.totalQuestions,
         result.correctAnswers,
         result.score,
         result.attemptNumber,
         JSON.stringify(result.answersData || []),
      ]);

      stmt.free();
      this.save();
   }

   getQuizResults(taskId = null) {
      if (!this.db) return [];

      let query = "SELECT * FROM quiz_results";
      let params = [];

      if (taskId) {
         query += " WHERE task_id = ?";
         params.push(taskId);
      }

      query += " ORDER BY completed_at DESC";

      const results = this.db.exec(query, params);

      if (!results.length) return [];

      const columns = results[0].columns;
      const rows = results[0].values;

      return rows.map((row) => {
         const result = {};
         columns.forEach((col, idx) => {
            result[col] = row[idx];
         });

         if (result.answers_data) {
            result.answers_data = JSON.parse(result.answers_data);
         }

         return result;
      });
   }

   getQuizAttempts(taskId) {
      if (!this.db) return 0;

      const results = this.db.exec(
         "SELECT COUNT(*) as count FROM quiz_results WHERE task_id = ?",
         [taskId],
      );

      return results.length ? results[0].values[0][0] : 0;
   }

   // Session operations
   addSession(session) {
      this.db.run(
         `
      INSERT INTO sessions (task_id, mode, subject, duration)
      VALUES (?, ?, ?, ?)
    `,
         [
            session.taskId || null,
            session.mode,
            session.subject || null,
            session.duration || 25,
         ],
      );

      this.save();
   }

   getAllSessions() {
      if (!this.db) return [];

      const results = this.db.exec(
         "SELECT * FROM sessions ORDER BY completed_at DESC",
      );

      if (!results.length) return [];

      const columns = results[0].columns;
      const rows = results[0].values;

      return rows.map((row) => {
         const session = {};
         columns.forEach((col, idx) => {
            session[col] = row[idx];
         });
         return session;
      });
   }

   // Stats operations
   getStats() {
      if (!this.db) return null;

      const results = this.db.exec("SELECT * FROM stats WHERE id = 1");

      if (!results.length) return null;

      const columns = results[0].columns;
      const values = results[0].values[0];

      const stats = {};
      columns.forEach((col, idx) => {
         stats[col] = values[idx];
      });

      return stats;
   }

   updateStats(updates) {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach((key) => {
         const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
         fields.push(`${dbKey} = ?`);
         values.push(updates[key]);
      });

      if (fields.length === 0) return;

      this.db.run(
         `
      UPDATE stats SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `,
         values,
      );

      this.save();
   }

   incrementStat(field, amount = 1) {
      const dbField = field.replace(/([A-Z])/g, "_$1").toLowerCase();
      this.db.run(
         `
      UPDATE stats SET ${dbField} = ${dbField} + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `,
         [amount],
      );

      this.save();
   }
}

// Create singleton instance
const database = new Database();

export default database;

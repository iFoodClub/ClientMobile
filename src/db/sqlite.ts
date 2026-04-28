import * as SQLite from "expo-sqlite";

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (databaseInstance) return databaseInstance;

  databaseInstance = SQLite.openDatabaseSync("app.db");
  return databaseInstance;
}

export async function runMigrations(): Promise<void> {
  const db = getDatabase();
  
  try {
    console.log('Executando migrações do banco de dados...');
    
    db.execSync(
      `
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        last_login_ts INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);

      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT,
        email TEXT,
        photo TEXT,
        data TEXT,
        updated_at_ts INTEGER NOT NULL DEFAULT (strftime('%s','now')),
        dirty INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    `
    );
    
    console.log('Migrações executadas com sucesso');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    throw error;
  }
}

export function withTransaction<T>(fn: (db: SQLite.SQLiteDatabase) => T): T {
  const db = getDatabase();
  return fn(db);
}

export function clearDatabase(): void {
  const db = getDatabase();
  try {
    console.log('Limpando banco de dados...');
    db.execSync('DROP TABLE IF EXISTS profiles');
    db.execSync('DROP TABLE IF EXISTS auth_sessions');
    console.log('Banco limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar banco:', error);
  }
}



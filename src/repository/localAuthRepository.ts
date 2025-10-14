import { withTransaction } from "../db/sqlite";

const ONE_DAY_SECONDS = 24 * 60 * 60;

export type LastLoginRecord = {
  userId: string;
  lastLoginTs: number; // epoch seconds
};

export const LocalAuthRepository = {
  saveLastLogin(userId: string, lastLoginTs: number) {
    return withTransaction((db) => {
      db.execSync(
        `INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${userId}', ${lastLoginTs})`
      );
    });
  },

  upsertLastLogin(userId: string, lastLoginTs: number) {
    return withTransaction((db) => {
      db.execSync(
        `DELETE FROM auth_sessions WHERE user_id = '${userId}'`
      );
      db.execSync(
        `INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${userId}', ${lastLoginTs})`
      );
    });
  },

  saveLastLoginOffline(userId: string, email: string, lastLoginTs: number) {
    return withTransaction((db) => {
      db.execSync(`INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${userId}', ${lastLoginTs})`);
      db.execSync(`INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${email}', ${lastLoginTs})`);
    });
  },

  /** Salva sessão tanto por id quanto por email, sempre usando o campo correto no banco */
  upsertLastLoginOffline(userId: string, email: string, lastLoginTs: number) {
    return withTransaction((db) => {
      db.execSync(`DELETE FROM auth_sessions WHERE user_id = '${userId}'`);
      db.execSync(`DELETE FROM auth_sessions WHERE user_id = '${email}'`);
      db.execSync(`INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${userId}', ${lastLoginTs})`);
      db.execSync(`INSERT INTO auth_sessions (user_id, last_login_ts) VALUES ('${email}', ${lastLoginTs})`);
    });
  },

  getLastLogin(userId: string): LastLoginRecord | null {
    return withTransaction((db) => {
      const res = db.getFirstSync<{ user_id: string; last_login_ts: number }>(
        `SELECT user_id, last_login_ts FROM auth_sessions WHERE user_id = '${userId}' ORDER BY id DESC LIMIT 1`
      );
      if (!res) return null;
      return { userId: res.user_id, lastLoginTs: res.last_login_ts };
    });
  },

  isLoginWithin24h(userId: string, nowTs?: number): boolean {
    const record = this.getLastLogin(userId);
    if (!record) return false;
    const now = typeof nowTs === "number" ? nowTs : Math.floor(Date.now() / 1000);
    return now - record.lastLoginTs <= ONE_DAY_SECONDS;
  },
};



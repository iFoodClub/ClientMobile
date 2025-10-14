import { withTransaction } from "../db/sqlite";

export type LocalProfile = {
  userId: string;
  name?: string | null;
  email?: string | null;
  photo?: string | null;
  data?: unknown;
  updatedAtTs: number;
  dirty: 0 | 1;
};

export const LocalProfileRepository = {
  upsertProfile(profile: Omit<LocalProfile, "updatedAtTs">) {
    // Validação adicional
    if (!profile.userId || profile.userId.trim() === '') {
      console.error('LocalProfileRepository.upsertProfile: userId é obrigatório', profile);
      throw new Error('userId é obrigatório');
    }
    
    return withTransaction((db) => {
      const nowTs = Math.floor(Date.now() / 1000);
      
      console.log('LocalProfileRepository.upsertProfile - Parâmetros:', {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        dirty: profile.dirty,
        nowTs: nowTs
      });
      
      try {
        // Primeiro, tenta deletar se existir
        console.log('LocalProfileRepository.upsertProfile - Deletando registro existente...');
        db.execSync(`DELETE FROM profiles WHERE user_id = '${profile.userId}'`);
        console.log('LocalProfileRepository.upsertProfile - Registro deletado com sucesso');
        
        // Verificar se a tabela existe e tem a estrutura correta
        console.log('LocalProfileRepository.upsertProfile - Verificando estrutura da tabela...');
        const tableInfo = db.getAllSync('PRAGMA table_info(profiles)');
        console.log('LocalProfileRepository.upsertProfile - Estrutura da tabela:', tableInfo);
        
        // Depois insere novo registro
        console.log('LocalProfileRepository.upsertProfile - Inserindo novo registro...');
        const name = profile.name ? `'${profile.name.replace(/'/g, "''")}'` : 'NULL';
        const email = profile.email ? `'${profile.email.replace(/'/g, "''")}'` : 'NULL';
        const photo = profile.photo ? `'${profile.photo.replace(/'/g, "''")}'` : 'NULL';
        const data = profile.data ? `'${JSON.stringify(profile.data).replace(/'/g, "''")}'` : 'NULL';
        
        const insertSQL = `INSERT INTO profiles (user_id, name, email, photo, data, updated_at_ts, dirty)
           VALUES ('${profile.userId}', ${name}, ${email}, ${photo}, ${data}, ${nowTs}, ${profile.dirty})`;
        
        console.log('LocalProfileRepository.upsertProfile - SQL:', insertSQL);
        db.execSync(insertSQL);
        
        console.log('LocalProfileRepository.upsertProfile - Inserção concluída com sucesso');
      } catch (error) {
        console.error('LocalProfileRepository.upsertProfile - Erro durante operação:', error);
        throw error;
      }
    });
  },

  markClean(userId: string) {
    return withTransaction((db) => {
      const nowTs = Math.floor(Date.now() / 1000);
      db.execSync(
        `UPDATE profiles SET dirty = 0, updated_at_ts = ${nowTs} WHERE user_id = '${userId}'`
      );
    });
  },

  getProfile(userId: string): LocalProfile | null {
    return withTransaction((db) => {
      const row = db.getFirstSync<{
        user_id: string;
        name: string | null;
        email: string | null;
        photo: string | null;
        data: string | null;
        updated_at_ts: number;
        dirty: number;
      }>(
        `SELECT user_id, name, email, photo, data, updated_at_ts, dirty FROM profiles WHERE user_id = '${userId}' LIMIT 1`
      );
      if (!row) return null;
      return {
        userId: row.user_id,
        name: row.name,
        email: row.email,
        photo: row.photo,
        data: row.data ? JSON.parse(row.data) : undefined,
        updatedAtTs: row.updated_at_ts,
        dirty: (row.dirty as 0 | 1) ?? 0,
      };
    });
  },

  // Função de debug para verificar o estado da tabela
  debugTable() {
    return withTransaction((db) => {
      try {
        const result = db.getAllSync<{
          id: number;
          user_id: string;
          name: string | null;
          email: string | null;
          dirty: number;
        }>('SELECT id, user_id, name, email, dirty FROM profiles');
        console.log('LocalProfileRepository.debugTable - Registros na tabela:', result);
        return result;
      } catch (error) {
        console.error('LocalProfileRepository.debugTable - Erro:', error);
        return [];
      }
    });
  },
};



import dbPromise from './db';

export async function runMigrations() {
  const db = await dbPromise;

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;

  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sobrenome TEXT,
        genero TEXT,
        aniversario TEXT,
        usuario TEXT UNIQUE,
        email TEXT UNIQUE,
        telefone TEXT,
        endereco TEXT,
        senha TEXT,
        isPrestador INTEGER,
        areaAtuacao TEXT,
        descricaoServicos TEXT
      );
    `);

    currentVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${currentVersion}`);
  }
}

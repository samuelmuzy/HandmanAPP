import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('handman.db');


export default db;

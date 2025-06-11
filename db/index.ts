import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database(process.env.DATABASE_FILE); // address of the sqlite3 databas file - data/database.db

// Create table if it doesn’t exist
// exec = execute raw SQL code 

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      surname TEXT,
      dateRegistered TEXT,
    )
  `);
// => Create a table called tickets with these columns, but only if it doesn't already exist
// id - number, main key to adress something, every row adds +1 to previous number
// NOT NULL means the value must be provided when inserting data, otherwise causes an error
// REAL is the data type — it means the column can store floating-point numbers (decimals).

export default db

// You can call getDb() in your route handlers to get a connected database instance.
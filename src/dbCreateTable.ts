// To create a new table object and then just reuse the function of creating a table on that object.
import dotenv from 'dotenv';
import { DB } from './db'

dotenv.config(); // This is super- important to have process.env

///

export type TableType = { // remember that id is always created at the query creating step
    tableName: string,
    [key: string]: string,
}

const notes: TableType = {
    tableName: `notes`,
    created_at: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    text: `TEXT NOT NULL`,
}



export function createTableQuery(table: TableType): string {
    let tableCreateQuery: string = `CREATE TABLE IF NOT EXISTS ${table.tableName} (id SERIAL PRIMARY KEY`;

    for (const [key, value] of Object.entries(table)) {
        if (key != 'tableName' && key != 'id') {
            tableCreateQuery = tableCreateQuery + ', ' + key.toString() + ' ' + value.toString();
        }
    }
    tableCreateQuery = tableCreateQuery + ')'; // Closing pattern

    return tableCreateQuery;
}

/// TEST ///
function createTableQueryTest() {
    const testTable1: TableType = {
        tableName: `notes`,
        id: `SERIAL PRIMARY KEY`,
        created_at: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        text: `TEXT NOT NULL`,
    }

    const result1 = `CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, text TEXT NOT NULL)`

    const test1: string = createTableQuery(testTable1);

    if (test1 === result1) {
        console.log(`test1 succeded`);
        return true;
    }
    else {
        console.log(`test1 failed`, test1, result1)
        return false;
    }


}

// createTableQueryTest();

async function createTable (table: TableType) {

    const runTest = createTableQueryTest();
    // just checking if there is something wrong in new additions to the rules
    // new table will not be tested cause we have no template to compare to
    if (!runTest) {
        throw new Error('Query auto-creating function test failed');
    }

    const createdQuery = createTableQuery(table);

    const db = DB(); // creating a DB Client 

    /// process.env.DATABASE_URL UNIDENTIFIED!!!
    // console.log(process.env.DATABASE_URL);
    // console.log(db.connection);
    console.log(db.database);


    try {
        await db.connect();
        await db.query(createdQuery);
        console.log(`Table ${table.tableName} created or already exists`);
    }
    catch (error) {
        console.error(`Failed to create ${table.tableName} table': ${error}`)
    }
    finally {
        await db.end()
    }

}

// createTable(notes);
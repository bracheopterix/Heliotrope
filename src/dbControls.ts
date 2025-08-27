// To create a new object and then just reuse the function of creating a table on that object.
import dotenv from 'dotenv';
import { DB } from './db'
import { QueryResult, Result } from 'pg'; // needed for transplanting DB
// import { createTableQuery, TableType } from './dbCreateTable' // this is table creating module

dotenv.config(); // This is super- important to have process.env

/// TYPES ///

type JsObj = { [column: string]: any };


export type TableType = { // remember that id is always created at the query creating step
    tableName: string,
    [key: string]: string,
}



/// CREATE TABLE ///

/// Table's list ///

const notes: TableType = {
    tableName: `notes`,
    // created_at: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    text: `TEXT NOT NULL`,
}

// ---- 

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

async function createTable(table: TableType) {

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

// createTable(notes,); 





/// GET TABLES DATA ///

export async function getBdTableNames() { // resulting in all names of db tables

    const db = DB();

    try {
        await db.connect();
        const queryResult = await db.query(`
            SELECT table_name 
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            `);

        const tableNames = queryResult.rows.map(row => row.table_name);
        return tableNames;
    }
    catch (error) {
        throw new Error(`Failed to get all table names from BD: ${error}`)
    }
    finally {
        await db.end();
    }
}

// async function getBDAllTableColumns(table: string) {

//     const db = DB();
//     let newTableObj = undefined;

//     try {

//         await db.connect();
//         newTableObj = await db.query(`
//             SELECT column_name, string 
//             FROM information_schema.columns
//             WHERE table_name = table;
//             `)

//     }
//     catch (error) {
//         console.log(`Getting table columns failed: ${table} ${error}`);
//     }
//     finally {
//         await db.end()
//     }
//     return newTableObj;
// }

async function getAllTableData(table: string) {
    const db = DB();
    // let newTableObj: TableType | undefined = undefined;
    let result = undefined
    try {

        await db.connect();
        result = await db.query(`
            SELECT * FROM ${table};
            `);

        console.log(result);
        console.log(result.fields.map(f => f.name));
        console.log(result.rows)
    }
    catch (error) {
        console.log(`Getting table columns failed: ${table} ${error}`);
    }
    finally {
        await db.end()
        return result;

        //result.fields = all fields - is an array of JS objects (name = string,format=type);
        //result.rows = all rows - is an array of JS objects
    }
}


function TableDataToTableTypeObj(table: string, tableData: QueryResult):TableType {


    const fields: JsObj[] = tableData.fields.map(f => ({ "name": f.name, "format": f.format })); // additional () to indicate that this is an object literal and not a functinal block!
    const rows: JsObj[] = tableData.rows;

    const newTableObj: TableType = {
        tableName: table,
    }

    for (let el of fields){



    }

    console.log(tableData)

    

    return newTableObj;

}

// getAllTableData("notes");



// DB TRANSPLANT

async function DbTransplant() {

    //get all tables (array) ->

    //      -> foreach table
    //      get table data (obj?)                       -> I am here
    //      create an empty TableType object             
    //      transplant a table ->
    //          -> foreach table.fields
    //             get table.fields.name
    //             get table.fields.format
    //             add a line to the TableType object name=>field & format=>type (switch for query??)
    //             create a table by function with TableTypeObj
    //      write all data from the table data.rows(array of objects) to the table
    //      ...profit

    const tableNamesArray: string[] = await getBdTableNames();
    for (let table of tableNamesArray) {

    }

}


//4. Possible missing considerations
//SQL injection risk
//SELECT * FROM ${table};
//If table comes from user input (not your DB query), wrap it in proper sanitization or a whitelist.
// Parallel vs serial fetching
// Right now, your for loop fetches tables one by one. For small DBs, fine.
// For large DBs, you could use Promise.all() to fetch all tables in parallel.
// Handling large tables
// SELECT * loads all rows into memory. Might be a problem for huge tables.
// Consider COPY TO STDOUT or streaming results for very large tables.
// Connection management
// You open and close a new connection for every function. It works, but it could be more efficient to re-use a single connection across multiple table queries.


// 5. Bottom line
// The algorithm you describe is legit.
// Main “steps” you might have skipped in planning:
// Security: validate table names.
// Efficiency: single DB connection or streaming for large tables.
// Memory: big tables may need chunking.
// Otherwise, it will run and fetch all tables and data as intended.



// /// 
// 3. Bulk / faster ways
// If the two DBs aren’t on the same server:
// Export → Import
// COPY notes TO 'file.csv' in DB1
// COPY notes FROM 'file.csv' in DB2
// Dump / Restore
// pg_dump DB1 → psql into DB2
// Foreign Data Wrapper (postgres_fdw)
// Lets you SELECT * FROM foreign_server.table and insert directly without touching your backend code.

//COPY notes TO STDOUT WITH CSV HEADER;

async function shortWay(){
    const db=DB();
    
    const query = ` ;`

    try{
        await db.connect();
        const result = await db.query(query);
        console.log(result);
    }catch(error){
        console.log(`Short way failed: ${error}`);
    }
    finally{
        await db.end();
    }
}

shortWay();

// Lets one Postgres server query tables on another Postgres server directly, almost like a linked table:
// SELECT * FROM foreign_server.notes;
// INSERT INTO local_notes SELECT * FROM foreign_server.notes;
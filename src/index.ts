import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { DB } from './db'
import { error } from "console";

// import { error } from "console";

const app = express(); // starting out serv

dotenv.config(); // this is loading environmental config from .env
app.use(cors()); // launches cors who knows what where and who in the internet lol
app.use(express.json()); // a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads

/// MAIN BLOCK /// 


app.listen(process.env.PORT, () => { // I am listening on env.PORT port all of incoming data and if all running smoothly - telling about it
    console.log(`Server is running on the port ${process.env.PORT}`,)
})

/// TIMERS AND BACKUP

async function getBdTableNames() {

    // const result = 0;
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
        return JSON.stringify(tableNames);
    }
    catch (error) {
        throw new Error(`Failed to get all table names from BD: ${error}`)
    }
    finally {
        await db.end();
    }
}


// async function backup() {

//     const BdTableNames = getBdTableNames(); // create and repin in the tables name

//     const tableArray = await getBdTableNames();
//     for(let table of tableArray){
//         console.log(table);
//     }

// }
// backup();


/// CHECKS ///


app.get('/', (req, res) => {

    try {
        res.send(JSON.stringify('Helios vivit'));
    }
    catch (error) {
        res.status(500).json({ error: "Initial server response failed" });
    }

})


app.get('/database/check', async (req, res) => {

    const db = DB(); // creating a DB Client 
    try {
        await db.connect();
        res.send(JSON.stringify(`Database connection succeeded`));
        console.log("Database connection established")
        await db.end();
    }
    catch (error) {
        () => res.send(JSON.stringify(`Database connection failed: ${error}`));
    }
})


app.get('/database/tables', async (req, res) => {
    // const db = DB();

    const result = await getBdTableNames();

    try {
        res.send(result);
    }
    catch (error) {
        res.send(JSON.stringify(`Failed to get all tables names: ${error}`))
    }
    finally {
        // await db.end();
    }
})


/// DATABASE CREATE TABLE ///


/// API ///

app.get('/api/notes', (req, res) => {

    try {
        const NewDataArray = Array(0);
        for (let i = 0; i < 999; i++) {
            NewDataArray.push(`New data ${i.toString()}`);
        }
        res.send(JSON.stringify(NewDataArray));
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get test note object" });
    }

})


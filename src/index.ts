import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { DB } from './db'
import { getBdTableNames, TableType } from './dbControls'
import { error } from "console";

import { NoteType } from "./types";

const app = express(); // starting out serv

dotenv.config(); // this is loading environmental config from .env
app.use(cors()); // launches cors who knows what where and who in the internet lol
app.use(express.json()); // a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads

/// MAIN BLOCK /// 


app.listen(process.env.PORT, () => { // I am listening on env.PORT port all of incoming data and if all running smoothly - telling about it
    console.log(`Server is running on the port ${process.env.PORT}`,)
})



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
    // console.log(result);

    try {
        res.send(JSON.stringify(result));
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


const testData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function* getNextPortionOfData(data: NoteType[] | undefined, slice: number) {
    //^Hello, I am a generator!
    let i = 0;
    if (data) {
        while (i < data.length) {
            yield data.slice(i, i + slice);
            i += slice;
        }
        return `Array's gone`;
    }
    else {
        return "Can't yield, data undefined";
    }

}

const newSlice = getNextPortionOfData(testData, 4).next();
/// let the client decide whats part it wants from the server


app.get('/api/notes/slice', async (req, res) => {
    const db = DB();

    const page = Number(req.query.page);
    const slice_size = Number(req.query.slice_size);

    const offset = page * slice_size;
    console.log(`page=${page},slice_size=${slice_size},offset=${offset}`);


    try {
        // console.log(`got a request ${req.query}`);

        await db.connect();
        const result = await db.query(`
            SELECT * FROM notes
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2;
            `,[slice_size,offset]);

        res.send(res.json(result.rows)); // returns {value, done]
    } catch (error) {
        res.status(500).json({ error: `Failed to get a data slice, ${error}`});
    } finally {
        await db.end()
    }
})




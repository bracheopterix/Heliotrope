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
        res.send(JSON.stringify("Database connection succeeded"));
        console.log("Database connection established")
        await db.end();
    }
    catch (error) {
        () => res.send(JSON.stringify(`Database connection failed: ${error}`));
    }
})


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


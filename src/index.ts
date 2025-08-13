import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { DB, connectDB, disconnectDB } from './db'

// import { error } from "console";

const app = express(); // starting out serv

dotenv.config(); // this is loading environmental config from .env
app.use(cors()); // launches cors who knows what where and who in the internet lol
app.use(express.json()); // a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads

/// MAIN BLOCK /// 


app.listen(process.env.PORT, () => { // I am listening on env.PORT port all of incoming data and if all running smoothly - telling about it
    console.log(`Server is running on the port ${process.env.PORT}`,)
})


/// SIMPLE ROUTES ///


/// Checking Database working
async function checkDb():Promise<boolean> {
    try {
        await connectDB();
        console.log("Database connected"); /// I DON"T GET IT IN THE CONSOLE! !!! SIMPLIFY AND GO FOR!!!
        await disconnectDB();
        return true;
    } catch (err) { () => { return err } };
    return false;
}

async function waitForDb(n: number) {
    return new Promise((resolve) => setTimeout(() => {
        return "Database is yet not connected, timeout of 1000ms exeeded";
    }, n));

}

async function raceDbCheck() {
    return Promise.race([
        checkDb(),
        waitForDb(1000),
    ])
}
////


app.get('/', (req, res) => {
    // let dbCheck = {};
    // raceDbCheck().then(answer=>dbCheck = JSON.stringify(answer));
    // const dbCheck = JSON.stringify(raceDbCheck());

    checkDb().then((answer)=>console.log("DB is on",answer));

    try {
        res.send(JSON.stringify('Helios vivit'));
        // res.send(JSON.stringify("Helios vivit" + dbCheck));

    } catch (error) {
        res.status(500).json({ error: "Failed to get an initial response" });
    }


})


app.post('/', (req, res) => {

    try {
        res.send("Editing right is denied");
    } catch (error) {
        res.status(500).json({ error: "Failed to get a standart post response" });
    }

})



app.get('/api/notes', (req, res) => {

    try {

        const NewDataArray = Array(0);

        for (let i = 0; i < 999; i++) {
            NewDataArray.push(`New data ${i.toString()}`);
        }

        res.send(JSON.stringify(NewDataArray));
    } catch (error) {
        res.status(500).json({ error: "Failed to get test note object" });
    }





})


import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';


const app = express(); // starting out serv

dotenv.config(); // this is loading environmental config from .env
app.use(cors()); // launches cors who knows what where and who in the internet lol
app.use(express.json()); // a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads

/// MAIN BLOCK /// 


app.listen(process.env.PORT, () => { // I am listening on env.PORT port all of incoming data and if all running smoothly - telling about it
    console.log(`Server is running on the port ${process.env.PORT}`,)
})


/// SIMPLE ROUTES ///

app.get('/', (req, res) => {

    try {
        res.send("Helios vivit");
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
        res.send(["note1", "note2", "note3"]);
    } catch (error) {
        res.status(500).json({ error: "Failed to get test note object" });
    }

})


import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

// this is your requests routes
import users from './routes/users';

// this is loading config from .env
dotenv.config();

// starting out serv
const app = express();

app.use(cors()); // launches cors ?
app.use(express.json()); // a piece of middleware in Express that allows your server to parse incoming requests with JSON payloads

// allows to correlate routers and routes??
app.use('/api/users',users) 

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on `)
})

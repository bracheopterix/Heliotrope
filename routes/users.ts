import express from 'express'; // we have express
import db from '../db'; // // this is our shared database instance


const router = express.Router(); // creates a new router instance for defining routes


router.get('/',(req,res)=>{

  try{

    const users = db.prepare('SELECT * FROM users').all(); // sync call with better-sqlite3
    res.json(users);

  }catch(error){

    console.log(error);
    res.status(500).json({error: "Failed to fetch users"});

  }

})

export default router;
import { Client, } from "pg"; 



export const DB = () => new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
})
// db should not be a constant
// cause you are creating it when calling the first time on import 
// even before you have a "process" to call process.env 
// so your process.env <= undefined



/// POOL? ///


// This is a template for the index.ts connections ->
    // app.get('/', async (_req, res) => {
    //     const result = await db.query('SELECT NOW()');
    //     res.send(result.rows);
    //   });
      
    //   app.listen(3000, () => console.log('Server running on port 3000'));
      
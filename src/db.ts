import { Client } from "pg"; 


export const DB = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

  export async function connectDB(): Promise<void> {
    await DB.connect();
  }


  export async function disconnectDB(): Promise<void>  {
    await DB.end();
  }

  



// This is a template for the index.ts connections ->
    // app.get('/', async (_req, res) => {
    //     const result = await db.query('SELECT NOW()');
    //     res.send(result.rows);
    //   });
      
    //   app.listen(3000, () => console.log('Server running on port 3000'));
      
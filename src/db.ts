import { Client, } from "pg"; 



export const DB = () => new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false 
    },
})

// db should not be a constant
// cause you are creating it when calling the first time on import 
// even before you have a "process" to call process.env 
// so your process.env <= undefined



export async function getBdTableNames() { // resulting in all names of db tables

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
        return tableNames;
    }
    catch (error) {
        throw new Error(`Failed to get all table names from BD: ${error}`)
    }
    finally {
        await db.end();
    }
}




/// POOL? ///


// This is a template for the index.ts connections ->
    // app.get('/', async (_req, res) => {
    //     const result = await db.query('SELECT NOW()');
    //     res.send(result.rows);
    //   });
      
    //   app.listen(3000, () => console.log('Server running on port 3000'));
      
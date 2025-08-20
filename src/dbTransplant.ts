// To create a new object and then just reuse the function of creating a table on that object.
import dotenv from 'dotenv';
import { DB, getBdTableNames } from './db' 
import {createTableQuery, TableType} from './dbCreateTable' // this is table creating module

// import type {TableType} from './dbCreateTable'


dotenv.config(); // This is super- important to have process.env




// Imports: SQLite Database & DAOs (Data Access Objects)
import * as SQLite from "expo-sqlite";
import { ScanSessionDao } from "./dao/scanSessionDao";

// Initialize and export the database connection
const db = SQLite.openDatabaseSync("stealthdetect.db");

// Initialize the database schema at once, create all necessary tables if they don't exist
const initDB = async () => {
    db.withTransactionSync(async () => {
        db.execSync(require('./schema').createAllTables);
    });
}

export default initDB();
// Imports: SQLite Database & DAOs (Data Access Objects)
import * as SQLite from "expo-sqlite";
import { ScanSessionDao } from "./dao/scanSessionDao";

// Initialize and export the database connection
const db = SQLite.openDatabaseSync("SD.db");

// Initialize the database schema if it doesn't exist
export const initDB = () => {
    db.withTransactionSync(tx => {
        ScanSessionDao.createTable();
        tx.executeSql(require('./schema').createIocMatchTable);
        tx.executeSql(require('./schema').createUserProfileTable);
        tx.executeSql(require('./schema').createAuthCredentialTable);
    });
}

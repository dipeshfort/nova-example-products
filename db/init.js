#!/usr/bin/env node
require('dotenv').config();
const pg = require('pg');

const TABLE_NAME = "products";

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.query(`
    DROP TABLE IF EXISTS ${TABLE_NAME};
    CREATE TABLE ${TABLE_NAME} (
        id integer NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT NOT NULL,
        poster VARCHAR(255) NOT NULL,
        release_date_str VARCHAR(10) NOT NULL,
        rating real NOT NULL,
        created TIMESTAMP DEFAULT current_timestamp,
        updated TIMESTAMP DEFAULT current_timestamp
    );
`).then((operationResult) => {
    console.log("DB Init", JSON.stringify(operationResult));
    closeConnection();
}).catch((err) => {
    console.log("ERROR", err);
    closeConnection();
});

function closeConnection() {
    if (client) {
        client.end();
    }
}
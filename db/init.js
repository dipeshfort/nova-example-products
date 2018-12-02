#!/usr/bin/env node
require('dotenv').config();
const pg = require('pg');

const TABLE_PRODUCTS = "products";
const TABLE_USER_PRODUCTS = "user_products";

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.query(`
    DROP TABLE IF EXISTS ${TABLE_PRODUCTS};
    CREATE TABLE ${TABLE_PRODUCTS} (
        id integer NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT NOT NULL,
        poster VARCHAR(255) NOT NULL,
        release_date_str VARCHAR(10) NOT NULL,
        rating real NOT NULL,
        price NUMERIC(4, 2),
        created TIMESTAMP DEFAULT current_timestamp,
        updated TIMESTAMP DEFAULT current_timestamp
    );
    DROP TABLE IF EXISTS ${TABLE_USER_PRODUCTS};
    CREATE TABLE ${TABLE_USER_PRODUCTS} (
        user_id UUID NOT NULL,
        product_id integer NOT NULL,
        purchase_date TIMESTAMPTZ DEFAULT current_timestamp,
        created TIMESTAMP DEFAULT current_timestamp,
        updated TIMESTAMP DEFAULT current_timestamp,
        PRIMARY KEY (user_id, product_id)
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
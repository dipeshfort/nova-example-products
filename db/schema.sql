DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id integer NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT NOT NULL,
    poster VARCHAR(255) NOT NULL,
    release_date_str VARCHAR(10) NOT NULL,
    rating real NOT NULL,
    created TIMESTAMP DEFAULT current_timestamp,
    updated TIMESTAMP DEFAULT current_timestamp
);
DROP TABLE IF EXISTS products;
CREATE TABLE products (
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

DROP TABLE IF EXISTS user_products;
CREATE TABLE user_products (
    user_id UUID NOT NULL,
    product_id integer NOT NULL,
    purchase_date TIMESTAMPTZ DEFAULT current_timestamp,
    created TIMESTAMP DEFAULT current_timestamp,
    updated TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY (user_id, product_id)
);
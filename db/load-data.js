#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const pg = require('pg');

const TABLE_NAME = "products";

main()
    .then((resp) => {
        console.log(resp);
    }).catch((error) => {
        console.log("ERROR", error);
    });

async function main() {
    const url = `${process.env.TMDB_URLBASE}/3/trending/movie/week`;
    const movies = await fetch(url, {
        api_key: process.env.TMDB_API_KEY,
        page: 1,
    });

    const inserts = movies.map(({ id, title, overview, poster, releaseDateStr, rating, price,}) => {
        return [id, title, overview, poster, releaseDateStr, rating, price]
    })

    return await execute(inserts);
}


async function fetch(url, params) {
    const  { data } = await axios.get(url, { params });
    const products = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: `${process.env.TMDB_POSTER_URLBASE}${movie.poster_path}`,
        releaseDateStr: movie.release_date,
        rating: movie.vote_average,
        price: calculatePrice(movie.vote_average),
    }));
    return products;
}

function calculatePrice(rating) {
    if (rating > 8) {
        return 5.99;
    } else if (rating > 6) {
        return 3.99;
    } else if (rating > 3) {
        return 2.99;
    } else {
        return 1.99;
    }
}

async function execute(inserts) {
    const text = `
        INSERT INTO ${TABLE_NAME} (id, title, overview, poster, release_date_str, rating, price )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
    `;
    const client = new pg.Client(process.env.DATABASE_URL);
    console.log("execute: Opening connection");
    client.connect();

    try {
        const promises = inserts.map(async (values) => {
            return await client.query({
                name: 'insert-product',
                text, 
                values
            });
        });
        const result = await Promise.all(promises);
        console.log("execute: query", JSON.stringify(result));
    } catch(err) {
        console.log("execute: DB error", err);
    }

    if (client) {
        console.log("execute: Closing connection")
        client.end();
    }
}
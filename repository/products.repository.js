const db = require('../utils/db');
const logger = require('../utils/logger');

class ProductsRepository {
    constructor(context) {
        this.table = 'products';
        this.context = context;
    }

    async fetchAll() {
        const result = await this.context.query(`SELECT * from ${this.table}`);
        logger.trace(`Returned ${result.rows.length} products.`);
        return result.rows.map((rowItem) => {
            return this.toProduct(rowItem)
        });
    }

    async executeQuery(query) {
        try {
            return await this.context.query(query)
        } catch (error) {
            let customError;

            if (!error.code) {
                throw error;
            }

            switch (error.code) {
                case 'ECONNREFUSED':
                    customError = new Error('Error connecting to database');
                    customError.code = 'ERR_DB_CONNECTION';
                    customError.details = '';
                    customError.original = error;
                    throw customError;
                default:
                    throw error;
            }
        }
    }

    toProduct(row) {
        return {
            id: row.id,
            title: row.title,
            overview: row.overview,
            poster: row.poster,
            releaseDateStr: row.release_date_str,
            rating: row.rating
        };
    }
}
module.exports = new ProductsRepository(db);
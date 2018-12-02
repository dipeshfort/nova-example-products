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

    async fetchUserProducts(userId) {
        const query = {
            name: 'query-user-products',
            text: `SELECT * FROM products AS p
                        INNER JOIN user_products AS up
                        ON p.id = up.product_id
                    WHERE up.user_id = $1`,
            values: [userId]
        };
        const result = await this.executeQuery(query)
        return result.rows.map((rowItem) => {
            return this.toUserProducts(rowItem)
        });
    }

    async purchaseProduct({ userId, productId}) {
        const query = {
            name: 'insert-user-products',
            text: `INSERT INTO user_products (user_id, product_id, purchase_date) VALUES($1, $2, $3)`,
            values: [userId, productId, new Date()]
        };
        const result = await this.executeQuery(query)
        if (result.rowCount !== 1) {
            throw new Error("ERROR_DB_FAIL::Unable to create resource");
        }
        return true;
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
            rating: row.rating,
            price: +row.price,
        };
    }

    toUserProducts(row) {
        return {
            product: this.toProduct(row),
            purchased: new Date(row.purchase_date)
        };
    }
}
module.exports = new ProductsRepository(db);
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const repository = require('../repository/products.repository');

router.get('/', async (req, res) => {
    try {
        const products = await repository.fetchAll();
        res.json(products);
    } catch (err) {
        error500(err, res);
    }
});


function error500(err, res) {
    logger.error(JSON.stringify(err));
    res.status(500);
    res.json({
        code: err.code,
        message: err.message
    });
}

module.exports = router;
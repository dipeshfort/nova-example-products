const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const repository = require('../repository/products.repository');
const axios = require('axios');
const invoiceService = require('../services/invoice.service');

router.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    const authorization = req.header('authorization');
    if (!authorization) {
        res.status(403);
        return res.json({
            message: 'Requires authentication'
        });
    }

    axios.get(`${process.env.SERVICE_USER}/auth/profile`, {
        headers: {
            'Authorization': authorization
        }
    }).then((resp) => {
        if (resp.data && resp.data.id) {
            res.locals.user = {
                ...resp.data,
                token: authorization.replace('Bearer ', '')
            };
            next();
        }
    }).catch((err) => {
        console.log(err);
        res.status(403);
        res.json({
            message: 'User verification failed'
        });
    });
});

router.get('/', async (req, res) => {
    try {
        const userProducts = await repository.fetchUserProducts(res.locals.user.id);
        res.json(userProducts);
    } catch (err) {
        error500(err, res);
    }
});

router.get('/purchase', async (req, res) => {
    const productId = req.query.product_id;
    const user = res.locals.user;
    const userId = user.id;
    
    try {
        const product = await repository.getProduct(productId);
        const result = await repository.purchaseProduct({userId, productId: product.id});
        logger.debug("Product purchased", JSON.stringify({
            userId,
            product,
        }));

        const dueDate = new Date();
        dueDate.setTime(dueDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        const invoice = {
            userId: userId,
            title: product.title,
            comments: "Purchase",
            amount: product.price,
            remindDate: dueDate.toISOString(),
        };

        
        const createInvoiceResult = await invoiceService.createInvoice(user.token, invoice);
        logger.debug("Invoice created", JSON.stringify({
            userId,
            createInvoiceResult,
        }));

        res.json({
            succcess: true,
        });
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
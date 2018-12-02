const axios = require('axios');


async function createInvoice(token, invoice) {
    const data = {
        ...invoice,
        status: "OPEN",
        created: new Date()
    };
    const api = `${process.env.SERVICE_INVOICE}/invoices`;
    console.info('Creating invoice', {
        token,
        api,
        invoice
    });
    const resp = await axios({
        method: 'POST',
        url: api,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`
        },
        data,
    })
    return resp.data;
}

module.exports = {
    createInvoice,
};
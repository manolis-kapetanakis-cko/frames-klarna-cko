const axios = require('axios');
const path = require('path');

const PK = "pk_test_...";
const SK = "sk_test_...";
const API = "https://api.sandbox.checkout.com/";



var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    app.post("/pay/", async (req, res) => {
        let token = req.body.token;

        let payment;
        try {
            payment = await axios.post(API + 'payments', {
                "source": {
                    "type": "token",
                    "token": token
                },
                "amount": 9900,
                "currency": "GBP",
                "reference": "ORD-5023-4E89"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });

    app.post("/refund/:p_id", async (req, res) => {
        let p_id = req.params.p_id;
        console.log(p_id);
        try {
            let payment = await axios.post(API + 'payments/' + p_id + '/refunds', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            res.status(200).send(payment.data.action_id);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });


    // KLARNA
    app.post("/klarnaSession/", async (req, res) => {
        console.log("Initialising Klarna Session");
        let payment;
        try {
            payment = await axios.post("https://api.sandbox.checkout.com/klarna-external/credit-sessions", {
                // "purchase_country": "GB",
                // "currency": "GBP",
                // "locale": "en-GB",
                // "amount": 2499,
                // "tax_amount": 1,
                // "products": [{
                //     "name": "Brown leather belt",
                //     "quantity": 1,
                //     "unit_price": 2499,
                //     "tax_rate": 0,
                //     "total_amount": 2499,
                //     "total_tax_amount": 0
                // }]
                "type": "klarna",
                "purchase_country": "GB",
                "currency": "GBP",
                "locale": "en-GB",
                "amount": 108000,
                "tax_amount": 18000,
                "products": [{
                    "name": "jewellery",
                    "quantity": 1,
                    "unit_price": 108000,
                    "tax_rate": 2000,
                    "total_amount": 108000,
                    "total_tax_amount": 18000
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            console.log(payment.data)
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });

    app.post("/klarnaPayment/", async (req, res) => {
        let authorization_token = req.body.authorization_token;
        console.log("Initialising Klarna Payment: " + authorization_token);

        let payment;
        try {
            payment = await axios.post(API + 'payments', {
                "source": {
                    "type": "klarna",
                    "authorization_token": authorization_token,
                    "billing_address": {
                        "city": "London",
                        "country": "GB",
                        "email": "svetoslav.test.25@rarepink.com",
                        "family_name": "Todorov",
                        "given_name": "Svetoslav",
                        "phone": "+359881234010",
                        "street_address": "27 Clements Lane",
                        "street_address2": "",
                        // "state": "", 
                        "postal_code": "EC4N 7AE",
                    },
                    "purchase_country": "GB",
                    "locale": "en-GB",
                    "tax_amount": 18000,
                    "products": [{
                        "name": "jewellery",
                        "quantity": 1,
                        "unit_price": 108000,
                        "tax_rate": 2000,
                        "total_amount": 108000,
                        "total_tax_amount": 18000
                    }]
                },
                "currency": "GBP",
                "amount": 108000,
                "capture": false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            console.log(payment.data)
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });
}

module.exports = appRouter;

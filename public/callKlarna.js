// KLARNA:
let promiseKlarna = new Promise((resolve, reject) => {
    let client_token
    $.post("/klarnaSession/", {},
        function (data, status) {
            client_token = data.client_token
            console.log("\DATA:\n");
            console.log(data);
            console.log("\nClient Token:\n" + client_token);
            if (client_token)
                resolve(client_token)
        })
}).then((client_token) => {
    console.log("\nKlarna...\n");
    window.klarnaAsyncCallback(client_token)
});

window.klarnaAsyncCallback = function (client_token) {
    console.log("\nKlarna Init. Token: " + client_token);
    // INIT
    try {
        console.log("\nKlarna Init. Try...");
        Klarna.Payments.init({
            client_token: client_token
        });
    } catch (e) {
        console.log("Init:" + e)
    }
    //LOAD...
    try {
        console.log("\nKlarna load...\n");
        Klarna.Payments.load(
            {
                container: "#klarna_container",
                payment_method_categories: ["pay_later", "pay_over_time"],
                instance_id: "klarna-payments-instance"
            }, {
            billing_address: {
                city: "London",
                country: "GB",
                email: "svetoslav.test.25@rarepink.com",
                family_name: "Todorov",
                given_name: "Svetoslav",
                phone: "+359881234010",
                postal_code: "EC4N 7AE",
                region: "",
                street_address: "27 Clements Lane",
                street_address2: ""
            }
        },
            // callback
            function (response) {
                console.log("Load Success:\n")
                console.log(response)
            }
        );
    } catch (e) {
        console.log("Load:\n" + e)
    }
};

// AUTHORISE
let klarnaAuth = function () {
    try {
        Klarna.Payments.authorize(
            // options
            {
                instance_id: "klarna-payments-instance" // Same as instance_id set in Klarna.Payments.load().
            }, {// data
            billing_address: {
                city: "London",
                country: "GB",
                email: "svetoslav.test.25@rarepink.com",
                family_name: "Todorov",
                given_name: "Svetoslav",
                phone: "+359881234010",
                postal_code: "EC4N 7AE",
                region: "",
                street_address: "27 Clements Lane",
                street_address2: ""
            }
        },
            function (response) {
                console.log("Authorise Success:\n")
                console.log(response)
                console.log("Response token: " + response.authorization_token)
                $.post("/klarnaPayment/", {
                    authorization_token: response.authorization_token
                },
                    function (data, status) {
                        console.log("Payment Successful\n");
                        console.log(data);
                        $('.paymentwrapper').html(
                            `<div class='container' style='margin-top: 20px;'>
                                <h1>Thank you for your order</h1>
                                <p>Total:  ${data.currency}  ` + data.amount / 100 + `</p>
                                <p>Try again <button onclick="window.location='/'">here</button></p>
                            </div>
                            `);

                    });
            }
        );
    } catch (e) {
        console.log("Authorise:\n" + e)
    }
}
///// End of Klarna setup

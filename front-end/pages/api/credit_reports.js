const init = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors'
    },
    method: 'POST'
}

export const order_list = (body, token) => {

    body.api_token = token;
    init.body = JSON.stringify({ ...body, api_token: token })

    // var myReq = new Request(`${process.env.API_URL}/report/list-order`, init);
    console.log('fetching');
    const ret = fetch(`${process.env.API_URL}/report/list-order`, init)
        .then((response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
        .then((response) => { return response.json() })
        .then((data) => {
            return data?.data
        })
        .catch((err) => {
            console.log(err)
        })
    return ret;
}

export const cancel_order = (rptId, token) => {
    if (!rptId) return;
    let body = { order_id: rptId, api_token: token }
    init.method = "POST"
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/cancel-order`, init);
    console.log('fetching');
    let ret = fetch(myReq)
        .then((response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
        .then((response) => { return response.json() })
        .then((data) => {
            return data?.data

        })
        .catch((err) => {

        })
    return ret;
}

export const order_details = (rptId, token) => {
    if (!rptId) return;
    let body = { "order_id": rptId, "api_token": token };

    init.method = "POST"
    init.body = JSON.stringify(body);


    var myReq = new Request(`${process.env.API_URL}/report/order-details`, init);
    let ret = fetch(myReq)
        .then((response) => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
        .then((response) => { return response.json() })
        .then((data) => {
            return data?.data
        })
        .catch((err) => {

        })
    return ret;

}

export const resubmit_report = ((rptData, token) => {
    init.method = "POST"
    init.body = { ...rptData, api_token: token }
    init.body = JSON.stringify(init.body);

    var myReq = new Request(`${process.env.API_URL}/report/`, init); //order-report
    console.log('fetching');
    let ret = fetch(myReq)
        .then((response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
        .then((response) => { return response.json() })
        .then((data) => {
            return data?.data
        })
        .catch((err) => {
            console.log(err)
        })
    return ret;
})

export const order_report = ((rptData, api) => {
    init.method = "POST"
    let body = rptData;
    body.api_token = api;
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/order-report`, init);
    console.log('fetching');
    let ret = fetch(myReq)
        .then((response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
        .then((response) => { return response.json() })
        .then((data) => {
            return data?.data
        })
        .catch((err) => {

        })
    return ret;
})

export const create_link_token = (rptData => {

})


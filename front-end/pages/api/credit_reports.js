const init = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors'
    },
    body: {
        api_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzM1MTVhMzFmN2YyYjUwNGI4N2Y1MyIsImVtYWlsX2lkIjoiaml0ZW5kcmFAamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTExLTE0VDE5OjI5OjMyLjQwMVoiLCJpYXQiOjE2MzY5MTgxNzJ9.vSVFsenePK75v8XAUbBUPZIxCqAc8rh7rSjnIDgKo44"
    }
}

export const order_list = (search, filter) => {
    init.method = "POST"
    init.body = JSON.stringify(init.body);

    var myReq = new Request(`${process.env.API_URL}/report/list-order`, init);
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
            return data.data
        })
        .catch((err) => {

        })
    return ret;
}

export const cancel_order = (rptId) => {
    if (!rptId) return;
    let body;
    try {
        body = JSON.parse(init.body);
    }
    catch (ex) {
        body = init.body;
    }

    body.order_id = rptId;
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
            return data.data

        })
        .catch((err) => {

        })
    return ret;
}

export const order_details = (rptId) => {

    if (!rptId) return;
    let body;
    try {
        body = JSON.parse(init.body);
    }
    catch (ex) {
        body = init.body;
    }

    body.order_id = rptId;
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
            return data.data
        })
        .catch((err) => {

        })
    return ret;

}

export const resubmit_report = (rptData => {
    init.method = "POST"
    init.body = { ...init.body, ...rptData }
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
            return data.data
        })
        .catch((err) => {

        })
    return ret;
})

export const order_report = (rptData => {
    init.method = "POST"
    init.body = { ...init.body, ...rptData }
    init.body = JSON.stringify(init.body);

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
            return data.data
        })
        .catch((err) => {

        })
    return ret;
})

export const create_link_token = (rptData => {

})


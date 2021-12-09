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
    return fetch(`${process.env.API_URL}/report/list-order`, init)
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
            return null;
        })

}

export const cancel_order = (rptId, token) => {
    if (!rptId) return;
    let body = { order_id: rptId, api_token: token }
    init.method = "POST"
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/cancel-order`, init);
    console.log('fetching');
    return fetch(myReq)
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
            return null;
        })

}

export const order_details = (rptId, token) => {
    if (!rptId) return;
    let body = { "order_id": rptId, "api_token": token };

    init.method = "POST"
    init.body = JSON.stringify(body);


    var myReq = new Request(`${process.env.API_URL}/report/order-details`, init);
    return fetch(myReq)
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


}

export const resubmit_report = ((rptData, token) => {
    init.method = "POST"
    init.body = { ...rptData, api_token: token }
    init.body = JSON.stringify(init.body);

    var myReq = new Request(`${process.env.API_URL}/report/`, init); //order-report
    console.log('fetching');
    return fetch(myReq)
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
})

export const order_report = ((rptData, api) => {
    init.method = "POST"
    let body = rptData;
    body.api_token = api;
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/order-report`, init);
    console.log('fetching');
    return fetch(myReq)
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
})

export const create_link_token = (rptData => {

})

export const add_comment = ((comment, token) => {
    if (!comment) return;
    let body = { ...comment, api_token: token }
    init.method = "POST"
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/comment-order`, init);
    console.log('fetching');
    return fetch(myReq)
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
});

export const update_status = ((status, token) => {
    if (!status) return;
    let body = { ...status, api_token: token }
    init.method = "POST"
    init.body = JSON.stringify(body);

    var myReq = new Request(`${process.env.API_URL}/report/update-status`, init);
    console.log('fetching');
    return fetch(myReq)
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
});

export const download_report_file = async (body) => {

    if (!body) return;

    init.method = "POST"
    init.body = JSON.stringify(body);

    try {
    var myReq = new Request(`${process.env.API_URL}/report/download-report`, init);
    console.log('fetching');
    return fetch(myReq)
        .then(async (response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                let test = await response.json();
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
    }
    catch (ex) {
        console.log(ex);
    }
}

export const delete_comment = (body => {
    init.body = JSON.stringify(body)
    // return fetch(`${process.env.API_URL}/report/delete-comment`, init)
})

export const update_pricing = (body => {
    init.body = JSON.stringify(body)
})

export const upload_report = (body => {
    init.body = body

    init.body = JSON.stringify(body)
    return fetch(`${process.env.API_URL}/report/upload-custom-report`, init)
        .then(async (response) => {
            console.log("Response: ", response)
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error("Error " + response.statusText);
                let test = await response.json();
                error.response = response;
                throw error;
            }
        }, (error) => {
            var err = new Error(error.message);
            throw err;
        })
})

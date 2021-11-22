const init = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'no-cors'
    }
}

export const credit_report_list = (search, filter) => {
    let body = {
        api_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzM1MTVhMzFmN2YyYjUwNGI4N2Y1MyIsImVtYWlsX2lkIjoiaml0ZW5kcmFAamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTExLTE0VDE5OjI5OjMyLjQwMVoiLCJpYXQiOjE2MzY5MTgxNzJ9.vSVFsenePK75v8XAUbBUPZIxCqAc8rh7rSjnIDgKo44",

    }

    if (search) body.search = search;
    if (filter) body.filter = filter;

    init.method = "POST"
    init.body = JSON.stringify(body);
    console.log(init.body)

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



export const cancel_credit_report = (rptId) => {
    let body = {
        api_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzM1MTVhMzFmN2YyYjUwNGI4N2Y1MyIsImVtYWlsX2lkIjoiaml0ZW5kcmFAamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTExLTE0VDE5OjI5OjMyLjQwMVoiLCJpYXQiOjE2MzY5MTgxNzJ9.vSVFsenePK75v8XAUbBUPZIxCqAc8rh7rSjnIDgKo44",
    }

    if (!rptId) return;
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

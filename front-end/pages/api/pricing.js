export const get_pricing_list = (body) => {
    return fetch(`${process.env.API_URL}/pricing/list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => {
            console.log(res)
            let ret = res.json();
            return ret;

        })
}
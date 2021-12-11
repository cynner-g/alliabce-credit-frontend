
export const upload_legal_list = (body) => {

    return fetch(`${process.env.API_URL}/report/list-legal-upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
}

export const get_legal_list = (body) => {
    return fetch(`${process.env.API_URL}/report/list-legal-upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
        .then(res => res.data)
}

export const delete_legal_list = (body) => {
    return fetch(`${process.env.API_URL}/report/delete-legal-upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
}
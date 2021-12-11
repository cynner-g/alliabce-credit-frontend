export const aging_list = (body) => {
    return fetch(`${process.env.API_URL}/aging/aging-list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(resUser => resUser.json())
        .then(data => data.data)
}

export const upload_aging_user_file = (form) => {
    return fetch(`${process.env.API_URL}/aging/upload-user-aging`, {
        method: "POST",
        headers: {
            contentType: false,
        },
        body: formData
    })
        .then(res => res.json());

}

export const upload_aging_DB_file = (form) => {
    return fetch(`${process.env.API_URL}/aging/upload-aging-db-file`, {
        method: "POST",
        headers: {
            contentType: false,
        },
        body: formData
    })
        .then(res => res.json());

}
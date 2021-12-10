export const list_companies = (body) => {
    return fetch(`${process.env.API_URL}/company/list-companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

}


export const get_company_details = (body) => {
    return fetch(`${process.env.API_URL}/company/company-detail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}

export const update_company = (body) => {
    return fetch(`${process.env.API_URL}/company/update-company`, {
        method: "POST",
        body: body
    }).then(res => res.json())
}

export const add_company = (body) => {
    return fetch(`${process.env.API_URL}/company/add-company`, {
        method: "POST",
        body: body
    })
}

export const add_sub_company = (body) => {
    return fetch(`${process.env.API_URL}/company//add-sub-company`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
}

export const remove_sub_company = (body) => {
    return fetch(`${process.env.API_URL}/company//remove-sub-company`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
}

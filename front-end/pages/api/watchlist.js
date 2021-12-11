export const remove_email = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/remove-email-from-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
})

export const add_email_to_watchlist = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/add-email-to-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
})

export const create_watchlist = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/create-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
})


export const get_watchlist_companies = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/companies-in-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(resCompanies => resCompanies.json())
        .then(companiesList => companiesList.data)
})

export const get_watchlist_emails = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/emails-in-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resEmails => resEmails.json())
        .then(emails => emails.data)
})

export const get_watchList = ((body) => {
    return fetch(`${process.env.API_URL}/watchlist/list-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resWL => resWL.json())
        .then(WL => WL.data)
})

export const add_company_to_watchlist = (body) => {
    return fetch(`${process.env.API_URL}/watchlist/add-company-to-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}
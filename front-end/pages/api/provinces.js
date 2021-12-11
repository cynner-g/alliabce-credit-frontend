export const get_provinces = (body => {
    return fetch(`${process.env.API_URL}/province/list-province`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(resUser =>
            resUser.json()
        )
        .then(prov =>
            prov.data
        )

})


export const add_province = (body => {
    return fetch(`${process.env.API_URL}/province/add-province`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})

export const update_province = (body => {
    return fetch(`${process.env.API_URL}/province/update-province`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})

export const activate_deactivate_province = (body => {
    return fetch(`${process.env.API_URL}/province/activate-decativate-province`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})
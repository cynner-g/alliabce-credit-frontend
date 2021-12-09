export const get_provinces = (body => {
    return fetch(`${process.env.API_URL}/provience/list-provience`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})


export const add_province = (body => {
    return fetch(`${process.env.API_URL}/provience/add-provience`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})

export const update_province = (body => {
    return fetch(`${process.env.API_URL}/provience/update-provience`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})

export const activate_deactivate_province = (body => {
    return fetch(`${process.env.API_URL}/provience/activate-decativate-provience`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})
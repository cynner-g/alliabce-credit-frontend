import Cookies from 'js-cookie'

export const get_user_details = async (body) => {


    return fetch(`${process.env.API_URL}/user/user-details`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'no-cors'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(ret => ret.json())
        .then(response => response.data)
        .catch((ex) =>
            console.log(ex.message)
        )
}

export const reset_password = ((body) => {
    return fetch(`${process.env.API_URL}/user/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(resUser => resUser.json())
})

export const delete_user = ((body) => {
    return fetch(`${process.env.API_URL}/user/delete-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(resUser => resUser.json())

})

export const update_user = ((body) => {
    return fetch(`${process.env.API_URL}/user/update-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(resUser => resUser.json())
})

export const create_sub_admin = ((body) => {
    return fetch(`${process.env.API_URL}/user/create-sub-admin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }).then(data => data.json())
})

export const change_password = ((body) => {
    return fetch(`${process.env.API_URL}/user/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
})

export const forgot_password = ((body) => {
    return fetch(`${process.env.API_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json());
})

export const login_user = ((body) => {
    return fetch(`${process.env.API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
})

export const list_sub_admin = ((body) => {
    return fetch(`${process.env.API_URL}/user/list-sub-admin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
})

export const list_associate_user = ((body) => {
    const req = fetch('${process.env.API_URL}/user/list-associate-user', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(req => req.json())
})

export const create_user = ((body) => {
    return fetch(`${process.env.API_URL}/user/create-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
})

export const list_user = (body) => {
    console.log(body)
    return fetch(`${process.env.API_URL}/user/list-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
}


export const verify_user = ((body) => {
    return fetch(`${process.env.API_URL}/user/verify-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)

    })
        .then(res => res.json())
})

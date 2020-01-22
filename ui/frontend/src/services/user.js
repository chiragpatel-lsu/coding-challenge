import axios from 'axios';

export async function authenticate({username, password}) {
    return await axios.post("http://localhost:9000/users/login", {username, password})
        .then(response => {
            if (!response || !response.data || !response.data.isValid) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: response.data.isValid,
                token: response.data.token,
                gifs: response.data.gifs
            }
        }).catch((e) => {
            // TODO log errors to server side
            console.log(e);
            return {
                isValid: false
            }
        })
}

export async function register({username, password, firstName, lastName}) {
    return await axios.post("http://localhost:9000/users/register", {
        username,
        password,
        firstName,
        lastName,
    }).then(response => {
        if (!response || !response.data || !response.data.isValid) {
            return {
                isValid: false
            }
        }

        return {
            isValid: response.data.isValid,
            token: response.data.token,
            gifs: response.data.gifs
        }
    }).catch((e) => {
        // TODO log errors to server side
        console.log(e);
        return {
            isValid: false
        }
    })
}

export async function addGif({username, token, gif}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    if (gif.categories && gif.categories.length > 0) {
        gif.categories = gif.categories.split(",").map(function (category) {
            return category.trim().toLowerCase();
        });
        gif.categories = [...new Set(gif.categories)];
    }

    return await axios.put(`http://localhost:9000/users/${username}/gif`, gif, {headers})
        .then(response => {
            if (!response || !response.data || !response.data.isValid) {
                return {
                    success: false
                }
            }

            return {
                success: response.data.success,
                token: response.data.token,
                gifs: response.data.gifs
            }
        }).catch((e) => {
            // TODO log errors to server side
            console.log(e);
            return {
                success: false
            }
        })
}

export async function getUserProfile({username, token}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    return await axios.get(`http://localhost:9000/users/${username}`, {headers})
        .then(response => {
            if (!response || !response.data) {
                return {
                    success: false
                }
            }
            return {
                gifs: response.data.gifs
            }
        }).catch((e) => {
            // TODO log errors to server side
            console.log(e);
            return {
                success: false
            }
        })
}
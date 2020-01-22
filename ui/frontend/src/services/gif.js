import axios from "axios";

export async function search({term, pageNumber, token}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    return await axios.get(`http://localhost:9000/gifs/search?term=${term}&page=${pageNumber}`, {headers}).then(response => {
        return response.data;
    }).catch((e) => {
        // TODO log errors to server side
        console.log(e);
        return {
            error: true,
            errorMessage: e
        }
    })
}
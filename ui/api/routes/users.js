const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;

    axios.post('http://localhost:8080/v1/api/oauth/authorize', {username, password})
        .then(response => {
            res.send({
                isValid: !!(response && response.data && response.data.token),
                token: response && response.data ? response.data.token : ''
            });
        }).catch((e) => {
        res.status(500).send(e);
    })

});

router.put('/:username/gif', (req, res, next) => {
    const username = req.params["username"];
    const token = req.headers['authorization'];

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
    };

    axios.put(`http://localhost:8080/v1/api/user/${username}/gif`, req.body, {headers})
        .then(response => {
            res.send({
                success: !!(response && response.data && response.data.error),
            });
        }).catch((e) => {
        res.status(500).send(e);
    })
});

router.post('/register', (req, res, next) => {
    const {username, password, firstName, lastName} = req.body;

    axios.post('http://localhost:8080/v1/api/user/register', {username, password, firstName, lastName})
        .then(response => {
            res.send({
                isValid: !!(response && response.data && response.data.token),
                token: response && response.data ? response.data.token : ''
            });
        })
        .catch((e) => {
            res.status(500).send(e);
        })
});

router.get('/:username', function (req, res, next) {
    const username = req.params["username"];
    const token = req.headers['authorization'];

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
    };

    axios.get(`http://localhost:8080/v1/api/user/${username}`, {headers})
        .then(response => {
            res.send({gifs: response.data.gifs});
        }).catch((e) => {
        res.status(500).send(e);
    })
});

module.exports = router;

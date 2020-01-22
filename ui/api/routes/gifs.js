const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', function (req, res, next) {
    let page = req.query.page;
    let term = req.query.term;
    const token = req.headers['authorization'];

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
    };

    const url = `http://localhost:8081/v1/api/gif/search?term=${term}&page=${page}`;
    axios.get(url, {headers})
        .then(response => {
            res.send({
                data: response.data
            });
        }).catch((e) => {
        res.status(500).send(e);
    })
});

module.exports = router;

const express = require('express');
const {data, getMatchPhrase, searchMatch, searchExactMatch}  = require('../serviceData')
const router = express.Router();
const {serverConfig: {baseUrlPrefix}, defaultConfig: {defaultSort, defaultOrderBy}} = require('../../config.js')

const getData = (req,res) => {
    try {
        let queryParam = req.query.query;
        const sortType = req.query.sort ? req.query.sort : defaultSort;
        const orderBy = req.query.orderBy ? req.query.orderBy : defaultOrderBy;

        const matchedPhrases = getMatchPhrase(queryParam,sortType,orderBy);
        res.send(matchedPhrases).end();
    } catch (e) {
        res.send("Internal server error").status(500).end();
    }

}

router.get('/search', (req, res) => {
    getData(req,res);
})

module.exports = (app) => app.use(baseUrlPrefix, router);

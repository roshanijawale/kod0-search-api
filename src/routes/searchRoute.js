const express = require('express');
const {data, getMatchPhrase, searchMatch, searchExactMatch}  = require('../serviceData')
const router = express.Router();
const {serverConfig: {baseUrlPrefix}, defaultConfig: {defaultSort, defaultOrderBy, defaultLimit, defaultOffset}} = require('../../config.js')
const validateQueryParameters = require('../utils/validation')

const getData = async (req,res) => {
    try {
        const queryParam = req.query.query;
        let sortType = req.query.sort ? req.query.sort : defaultSort;
        let orderBy = req.query.orderBy ? req.query.orderBy : defaultOrderBy;
        let limit = req.query.limit ? req.query.limit : defaultLimit;
        let offset = req.query.offset ? req.query.offset : defaultOffset;

        sortType, orderBy, offset, limit = await validateQueryParameters(sortType, orderBy, offset, limit);

        const matchedPhrases = getMatchPhrase(queryParam,sortType,orderBy);

        limit = parseInt(offset) + parseInt(limit)

        res.setHeader("total-records", matchedPhrases.length);
        res.send(matchedPhrases.slice(offset, limit)).end();

    } catch (e) {
        console.log(e)
        res.send({'message' : e.message}).status(500).end();
    }

}

router.get('/search', (req, res) => {
    getData(req,res);
})

module.exports = (app) => app.use(baseUrlPrefix, router);

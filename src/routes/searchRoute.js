const express = require('express');
const {data, batchFilterData, searchMatch, searchExactMatch}  = require('../service/serviceData')
const router = express.Router();
const {serverConfig: {baseUrlPrefix}, defaultConfig: {defaultSort, defaultOrderBy, defaultLimit, defaultOffset}} = require('../../config.js')
const validateQueryParameters = require('../utils/validation')

router.get('/search', async (req, res) => {
    try {
        const searchString = req.query.searchString;
        let sortTypeHeader = req.query.sort ? req.query.sort : defaultSort; //sortBy
        let orderByHeader = req.query.orderBy ? req.query.orderBy : defaultOrderBy;
        let limitHeader = req.query.limit ? req.query.limit : defaultLimit;
        let offsetHeader = req.query.offset ? req.query.offset : defaultOffset;

        let { sortType, orderBy, offset, limit } = validateQueryParameters(sortTypeHeader, orderByHeader, offsetHeader, limitHeader);

        const { total, matchedPhrases } = await batchFilterData(searchString, sortType, orderBy, offset, limit );

        res.setHeader("total-records", total);
        res.send(matchedPhrases).end();

    } catch (e) {
        res.status(e.statusCode || 500).json({'message' : e.message}).end();
    }
})

module.exports = (app) => app.use(baseUrlPrefix, router);

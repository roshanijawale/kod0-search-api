const validateQueryParameters = async (sortType, orderBy, offset, limit) => {
    const err = {
      statusCode: 400
    };

    orderBy = orderBy.toLowerCase();
    sortType = sortType.toLowerCase();
    limit = parseInt(limit);
    offset = parseInt(offset);

    if(!Number.isInteger(limit) || !Number.isInteger(offset)) {
        err.message = "limit and offset must be an integer value";
        throw err;
    } else if(!orderBy === 'name' || !orderBy === 'dateLastEdited') {
        err.message = "orderBy value must be name or dateLastEdited";
    } else if(!sortType === 'asc' || !sortType === 'desc') {
        err.message = "sort value must be asc or desc";
    } else {
        return orderBy, sortType, offset, limit;
    }

}

module.exports = validateQueryParameters;
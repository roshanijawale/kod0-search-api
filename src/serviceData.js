const { getData } = require('./database/fetchData.js')

const getMatchPhrase = (queryParam,sortType,orderBy) => {
    let matchedPhrases = [];

    if(queryParam) {
        if(queryParam[0].includes('"') && queryParam[queryParam.length-1].includes('"')) {
            queryParam = queryParam.slice(1 , queryParam.length-2)
            matchedPhrases = searchExactMatch(queryParam);
        } else {
            matchedPhrases = searchMatch(queryParam);
        }
    } else {
        matchedPhrases = getData();
    }

    if(orderBy === 'dateLastEdited') {
        return(sortByDateLastEdited (matchedPhrases, sortType));
    } else {
        return( sortByName(matchedPhrases, sortType));
    }
}

const searchMatch = (query) => {
    const searchTerms = query.split(' ');
    const matchedPhrases = getData().filter(object => {
        let isValid = true;
        for (let i=0; i<searchTerms.length; i++) {
            isValid = isValid && compare(object, searchTerms[i]);
        }
        return isValid;
    })
    return matchedPhrases;
}

const searchExactMatch = (queryParam) => {
    const matchedPhrases = getData().filter(object => compare(object, queryParam));
    return matchedPhrases;
}

function compare(object, term) {
    return object.name.toLowerCase().includes(term.toLowerCase()) || object.description.toLowerCase().includes(term.toLowerCase());
}

function sortByDateLastEdited (matchedPhrases, sortType) {
    return matchedPhrases.sort((a, b) => {
                    let firstDate = new Date(a.dateLastEdited),
                        secondDate = new Date(b.dateLastEdited);
                    return (sortType ==='asc' ? firstDate - secondDate : secondDate - firstDate);
                });
}

function sortByName (matchedPhrases, sortType) {
     return matchedPhrases.sort((a, b) => {
                  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return ( sortType === 'asc' ? -1 : 1);
                  }
                  if (nameA > nameB) {
                    return ( sortType === 'asc' ? 1 : -1);
                  }
                  // names must be equal
                  return 0;
                });
}

module.exports = {
getMatchPhrase,
searchMatch,
searchExactMatch}
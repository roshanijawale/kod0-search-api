const { fetchMoviesFromDatabase } = require('../database/fetchData.js')
const {defaultConfig: {defaultSort, defaultOrderBy, defaultLimit, defaultOffset}} = require('../../config.js')

const batchFilterData = async (searchString, sortType, orderBy, offset = defaultOffset, limit = defaultLimit ) => { // rename batchFilterData
    let matchedPhrases = [];
    const movies = await fetchMoviesFromDatabase(); //fetchMoviesFromDatabase
    if (searchString) { //searchString
        if (searchString[0].includes('"') && searchString[searchString.length-1].includes('"')) {
            searchString = searchString.slice(1 , searchString.length-2)
            matchedPhrases = searchExactMatch(movies, searchString);
        } else {
            matchedPhrases = searchMatch(movies, searchString);
        }
    } else {
        matchedPhrases = movies;
    }

    if (orderBy === 'dateLastEdited') {
        matchedPhrases = sortByDateLastEdited(matchedPhrases, sortType);
    } else if (orderBy === 'name'){
        matchedPhrases = sortByName(matchedPhrases, sortType);
    }

    return { 'total': matchedPhrases.length, 'matchedPhrases': matchedPhrases.slice( offset, offset + limit ) }
}

const searchMatch = (movies, searchString) => {
    const searchTerms = searchString.split(' ');
    const matchedPhrases = movies.filter(movie => {
        let isValid = true;
        for (let i = 0; i < searchTerms.length; i++) {
            isValid = isValid && compare(movie, searchTerms[i]);
        }
        return isValid;
    })
    return matchedPhrases;
}

const searchExactMatch = (movies, searchString) => {
    const matchedPhrases = movies.filter(movie => compare(movie, searchString));
    return matchedPhrases;
}

function compare(movie, term) {
    return movie.name.toLowerCase().includes(term.toLowerCase()) || movie.description.toLowerCase().includes(term.toLowerCase());
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
    batchFilterData,
    searchMatch,
    searchExactMatch
}
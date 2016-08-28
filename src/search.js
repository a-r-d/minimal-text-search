import RabinKarp from './rabin-karp';

function Search(config, store) {
  this._config = config;
  this._store = store;

  const substringSearch = (term, opts = {}) => {
    if(!term) {
      return [];
    }

    const matches = [];
    let index = 'lowercase';
    if(opts.caseSensitive === true) {
      index = 'cleanedDocuments';
    } else {
      term = term.toLowerCase();
    }

    this._store._index[index].forEach((doc) => {
      const res = RabinKarp(doc._combined, term);
      if(res.length > 0) {
        matches.push({
          document: doc,
          hits: res.length,
          matches: res
        });
      }
    });

    return matches;
  }

  const tokenBasedSearch = (terms) => {
    throw new Error('Not implemented');
  }

  return {
    substring: substringSearch,
    token: tokenBasedSearch
  };
}

export default Search;

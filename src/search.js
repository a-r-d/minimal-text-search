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
          document: doc._document,
          hits: res.length,
          matches: res
        });
      }
    });

    matches.sort((a, b) => {
      return b.hits - a.hits;
    });
    return matches;
  }

  return {
    substring: substringSearch
  };
}

export default Search;

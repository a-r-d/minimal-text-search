import Store from './store';
import Search from './search';
import Config from './config';

function MinimalTextSearch(documentConfig, optionalParams) {
  this._config = new Config(documentConfig, optionalParams);
  this._store = new Store(this._config);
  this._search = new Search(this._config, this._store);

  return {
    _config: this._config,
    _store: this._store,
    add: this._store.add,
    remove: this._store.remove,
    exactMatch: this._search.substring,
    wordMatch: this._search.token
  };
};

export default MinimalTextSearch;

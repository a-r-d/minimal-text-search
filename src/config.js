
function Config(documentConfig, optionalParams = {}) {
  const _documentConfig = documentConfig;
  const _options = Object.assign({}, optionalParams);

  if(!documentConfig) {
    throw new Error('Please provide a document index configuration');
  }

  function FieldConfigurator(docConf) {
    const fields = []
    let theref = null;

    this.field = (key, params) => { // ignore params for now
      fields.push(key);
    }
    this.ref = (key, params) => {
      if(theref) {
        throw new Error('cannot have more than one ref in document config: ' + key);
      }
      theref = key;
    }

    docConf.call(this);
    return {
      fields,
      ref: theref
    };
  }

  const fieldConfigResults = new FieldConfigurator(_documentConfig);

  function selectSearchableFields(document) {
    const cpy = {};
    fieldConfigResults.fields.forEach((f) => {
      cpy[f] = document[f];
    });

    // ._ref should be non-enumerable so we dont accidentely transform or search on it.
    Object.defineProperty(cpy, '_ref', {
      enumerable: false,
      value: document[fieldConfigResults.ref]
    });
    return cpy;
  }

  return {
    selectSearchableFields: selectSearchableFields,
    fieldsToIndex: fieldConfigResults.fields,
    ref: fieldConfigResults.ref,
    options: _options
  }
}

export default Config;


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

  function selectSearchableFields(doc) {
    let tmp = '';
    // combine all of the fields
    fieldConfigResults.fields.forEach((f) => {
      tmp += doc[f] + '\n';
    });
    return {
      _combined: tmp,
      _document: doc,
      _ref: doc[fieldConfigResults.ref]
    };
  }

  return {
    selectSearchableFields: selectSearchableFields,
    fieldsToIndex: fieldConfigResults.fields,
    ref: fieldConfigResults.ref,
    options: _options
  }
}

export default Config;


function safeLowerCase(str) {
  if(str) {
    return str.toLowerCase();
  }
  return str;
}

function Store(config) {
  const _config = config;
  const index = {
    cleanedDocuments: [],
    lowercase: [],
    rawDocuments: []
  };

  const submitToIndex = (item) => {
    index.rawDocuments.push(item);

    const cleaned = _config.selectSearchableFields(item);
    index.cleanedDocuments.push(cleaned);

    const lowercase = Object.assign({}, cleaned);
    lowercase._combined = safeLowerCase(lowercase._combined);

    index.lowercase.push(lowercase);
  }

  const removeFromIndex = (itemKey) => {
    let pos = -1;
    for(let i = 0; i < index.rawDocuments.length; i++) {
      if(index.rawDocuments[i][_config.ref] === itemKey) {
        pos = i;
        break;
      }
    }
    if(pos >= 0) {
      // these are all parallel arrays.
      index.rawDocuments.splice(pos, 1);
      index.lowercase.splice(pos, 1);
      index.cleanedDocuments.splice(pos, 1);
    }
    return pos;
  }

  return {
    _docs: index.rawDocuments,
    _index: index,
    add: submitToIndex,
    remove: removeFromIndex
  }
}

export default Store;

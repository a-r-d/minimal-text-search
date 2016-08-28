
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

    const lowercase = {};
    let combined = '';
    let combinedLC = '';
    Object.keys(cleaned).forEach((k) => {
      lowercase[k] = safeLowerCase(cleaned[k]);
      combined += cleaned[k] + '\n';
      combinedLC += safeLowerCase(cleaned[k]) + '\n';
    });
    Object.defineProperty(lowercase, '_ref', {
      enumerable: false,
      value: cleaned._ref
    });
    Object.defineProperty(cleaned, '_combined', {
      enumerable: false,
      value: combined
    });
    Object.defineProperty(lowercase, '_combined', {
      enumerable: false,
      value: combinedLC
    });
    index.lowercase.push(lowercase);
  }

  const removeFromIndex = (itemKey) => {

  }

  return {
    _docs: index.rawDocuments,
    _index: index,
    add: submitToIndex,
    remove: removeFromIndex
  }
}

export default Store;

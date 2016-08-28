# Minimal Text Search

This is a dependency free reverse index text search system that is meant to be small, fast and limited.

## Similarities to Lunr.js

This is not meant to be a drop in replacement for Lunr.js, but I have tried to emulate their interfaces where possible.

The only search capability that is currently implemented is exact substring match.


## How to Index:

```javascript

import MinimalTextSearch from 'minimal-text-search';

// same field config API as lunr
const search = new MinimalTextSearch(function() {
  this.field('name');
  this.field('address');
  this.ref('id');
});

search.add({
  name: 'Elon Musk',
  address: 'Los Angeles, CA',
  dateOfBirth: 'N/A',
  id: 45400
});

search.add({
  name: 'Benjamin Franklin',
  address: 'Philadelphia, PA',
  dateOfBirth: 'Unknown',
  id: 45500
});

search.add({
  name: 'Johannes Brahms',
  address: 'Vienna, Austria',
  dateOfBirth: '7 May 1833',
  id: 45600
});

const results1 = search.exactMatch('frank');  // 1 results
const results2 = search.exactMatch('frank', { caseSensitive: true });  // 0 results


```

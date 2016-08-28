import MinimalTextSearch from '../src/index';
import faker from 'faker';
import microtime from 'microtime';
const assert = require('assert');

const people1 = [{
    name: 'Elon Musk',
    address: 'Los Angeles, CA',
    dateOfBirth: 'N/A',
    id: 45400
  }, {
    name: 'Benjamin Franklin',
    address: 'Philadelphia, PA',
    dateOfBirth: 'Unknown',
    id: 45500
  }, {
    name: 'Johannes Brahms',
    address: 'Vienna, Austria',
    dateOfBirth: '7 May 1833',
    id: 45600
  }
];

const search = new MinimalTextSearch(function() {
  this.field('name');
  this.field('address');
  this.ref('id');
});

people1.forEach((p) => {
  search.add(p);
});

describe('MinimalTextSearch', function() {

  it('exactMatch should do a simple search on a small data set', function() {
    const results = search.exactMatch('frank');  // 1 results
    const results2 = search.exactMatch('frank', { caseSensitive: true });  // 0 results

    assert(results.length === 1, 'one result for frank');
    assert(results2.length === 0, 'zero results for case sensitive search');
  });

  it('exactMatch should not blow up falsey values', function() {
    const results = search.exactMatch('');
    const results2 = search.exactMatch(null);

    assert(results.length === 0, 'no results for empty string');
    assert(results2.length === 0, 'no results for null');
  });

  it('exactMatch should sort results with multiple hits to the top', function() {
    const search2 = new MinimalTextSearch(function() {
      this.field('name');
      this.field('address');
      this.ref('id');
    });

    people1.forEach((p) => {
      search2.add(p);
    });
    search2.add({
      name: 'derp derper, esquire',
      address: 'Madison Ave, New York, NY',
      id: 4893
    });
    search2.add({
      name: 'thomas edison',
      address: '12234 derp lane',
      id: 45903
    });

    const res = search2.exactMatch('derp');
    //console.log('res', res);
    assert(res[0].hits === 2, 'first entry should be 2 hits');
  });

  it('exactMatch should require a config function', function() {
    const msg = 'Please provide a document index configuration';
    let err;
    try {
      const s = new MinimalTextSearch();
    } catch (e) {
      err = e.message;
    }
    assert(msg === err, 'message was invalid: ' + err);
  });

  it('search.add should build the index correctly', function() {
    //console.log('Search object', search);
    assert(search._store._docs.length === 3, 'indexed 3 documents');
    //console.log('store: ', search._store._index);
    assert(search._store._index.rawDocuments.length === 3, 'indexed 3 documents');
    assert(search._store._index.cleanedDocuments.length === 3, 'indexed 3 documents');
    assert(search._store._index.lowercase.length === 3, 'indexed 3 documents');

    // make sure lowercase index is properly formed
    assert(search._store._index.cleanedDocuments[0]._combined !== search._store._index.cleanedDocuments[0]._combined.toLowerCase(), 'lowercase check');
    assert(search._store._index.lowercase[0]._combined === search._store._index.lowercase[0]._combined.toLowerCase(), 'lowercase check');

    // refs
    assert(45400 === search._store._index.cleanedDocuments[0]._ref, 'refs must be propagated to cleaned docs');
    assert(45400 === search._store._index.lowercase[0]._ref, 'refs must be propagated to lowercase docs');
  });

  it('remove should work', function() {
    const search2 = new MinimalTextSearch(function() {
      this.field('name');
      this.field('address');
      this.ref('id');
    });

    people1.forEach((p) => {
      search2.add(p);
    });
    search2.add({
      name: 'thomas edison',
      address: '12234 derp lane',
      id: 45903
    });

    const pos = search2.remove(45400);
    assert(pos === 0, 'should remove @ position zero');
    //console.log(search2._store._index);
    assert(45400 !== search2._store._index.cleanedDocuments[0]._ref, 'doc must be gone');
    assert(45400 !== search2._store._index.lowercase[0]._ref, 'doc must be gone');
    assert(45400 !== search2._store._index.rawDocuments[0].id, 'doc must be gone');

    const pos2 = search2.remove(45903);
    assert(search2._store._index.lowercase.length === 2, 'only 2 docs left');
  });

});

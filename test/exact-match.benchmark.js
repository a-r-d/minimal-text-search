import MinimalTextSearch from '../src/index';
import faker from 'faker';
import microtime from 'microtime';
const assert = require('assert');

const randSubStringOfLen = (str, len) => {
  if(!str || str.length < len) {
    return str;
  }

  const space = str.length - len;
  const randLoc = Math.floor(Math.random() * space);
  return str.substring(randLoc, randLoc + len);
}

describe('MinimalTextSearch (Benchmark)', function() {

  it('exactMatch be able to search thousands of documents quickly', function() {
    const search = new MinimalTextSearch(function() {
      this.field('name');
      this.field('address');
      this.field('description');
      this.ref('id');
    });

    const len = 5000;
    let i = 1;
    const mkPerson = () => {
      return {
        id: i++,
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        description: faker.lorem.lines()
      };
    }
    for(let j = 0; j < len; j++) {
      search.add(mkPerson());
    }

    //console.log(search._store._index.lowercase);
    // find a random name
    const nm = search._store._index.lowercase[Math.floor((Math.random() * len))].name;
    let namePart = search._store._index.lowercase[Math.floor((Math.random() * len))].name;
    namePart = randSubStringOfLen(namePart, 7);
    let randmIpsum1 = search._store._index.lowercase[Math.floor((Math.random() * len))].description;
    randmIpsum1 = randSubStringOfLen(randmIpsum1, 10);
    let randmIpsum2 = search._store._index.lowercase[Math.floor((Math.random() * len))].description;
    randmIpsum2 = randSubStringOfLen(randmIpsum2, 14);

    const s1 = microtime.now();
    const resultsName = search.exactMatch(nm);  // 1 results
    const s2 = microtime.now();
    const resultsNamePart = search.exactMatch(namePart);  // 0 results
    const s3 = microtime.now();
    const resIpsum1 = search.exactMatch(randmIpsum1);
    const s4 = microtime.now();
    const resIpsum2 = search.exactMatch(randmIpsum2);
    const s5 = microtime.now();

    console.info(`\t\tSearch on ${len} documents (name) for term ${nm} took ${s2 - s1} us`);
    console.info(`\t\tSearch on ${len} documents (name) for term ${namePart} took ${s3 - s2} us`);
    console.info(`\t\tSearch on ${len} documents (description) for term ${randmIpsum1} took ${s4 - s3} us`);
    console.info(`\t\tSearch on ${len} documents (description) for term ${randmIpsum2} took ${s5 - s4} us`);

    //console.log('results: ', results, results2);
    assert(resultsName.length > 0, 'known existing term');
    assert(resultsNamePart.length > 0, 'known existing term');
    assert(resIpsum1.length > 0, 'known existing term');
    assert(resIpsum2.length > 0, 'known existing term');

  });
});

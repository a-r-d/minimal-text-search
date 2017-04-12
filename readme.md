# Minimal Text Search
[![Build Status](https://travis-ci.org/a-r-d/minimal-text-search.svg?branch=master)](https://travis-ci.org/a-r-d/minimal-text-search) [![npm version](https://badge.fury.io/js/minimal-text-search.svg)](https://badge.fury.io/js/minimal-text-search) [![Code Climate](https://codeclimate.com/github/a-r-d/minimal-text-search/badges/gpa.svg)](https://codeclimate.com/github/a-r-d/minimal-text-search)

[![NPM](https://nodei.co/npm/minimal-text-search.png)](https://nodei.co/npm/minimal-text-search/)

This is a dependency free text substring search system that is meant to be small, fast enough and limited. I have tested this on a modern desktop and it takes about 16 ms to search for a substring in 5000 records. If you try to use this for more than a few thousand records it is going to be more than a few milliseconds to search, but as this is only meant for client side JS I think you may have other problems

## install

```
npm install --save minimal-text-search
```

## Similarities to Lunr.js

This is not meant to be a drop in replacement for Lunr.js, the only thing I have implement is a very simple substring search, but I have tried to emulate their interfaces where possible.

The only search capability that is currently implemented is exact substring match.


## How to Index and Search:

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

const results1 = search.exactMatch('frank');  // 1 result
const results2 = search.exactMatch('frank', { caseSensitive: true });  // 0 results
const res3 = search.exactMatch('min Fra'); // 1 result

```


## What does Result Structure look like?

```javascript

// assume that the same dataset above has been used

const res4 = search.exactMatch('es'); // 2 results (Johannes and Angeles will match)

console.log(res4);
```

The log statment yields:

```javascript

// You will get an array of hits. If no results you get empty array.
[
  {
    document:                          // A link to the original document (not a copy)
     {
       name: 'Elon Musk',
       address: 'Los Angeles, CA',
       dateOfBirth: 'N/A',
       id: 45400
     },
    hits: 1,                           // Total hits in this document
    matches: [ 19 ] },                 // Hit position of where it found a match
  {
    document:
     {
       name: 'Johannes Brahms',
       address: 'Vienna, Austria',
       dateOfBirth: '7 May 1833',
       id: 45600
     },
    hits: 1,
    matches: [ 6 ]
  }
]

```

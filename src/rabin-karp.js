
function RabinKarp(searchspace, pattern) {
  const m = pattern.length,
    n = searchspace.length,
    q = 101,
    charSize = 256;
  let patternHash = 0,
    searchHash = 0,
    hash = 1,
    matches = [],
    i = 0,
    j = 0;

  if(n < m) {
    return -1;
  }

  while(i < m - 1) {
    hash = (hash * charSize) % q;
    i++;
  }

  i = 0;
  while(i < m) {
    patternHash = (charSize * patternHash + pattern.charCodeAt(i)) % q;
    searchHash = (charSize * searchHash + searchspace.charCodeAt(i)) % q;
    i++;
  }

  i = 0;
  while(i < n - m + 1) {
    if(patternHash === searchHash) {

      j = 0;
      while(j < m) {
        if(searchspace[i + j] !== pattern[j]) {
          break;
        }
        j++;
      }
      
      if(j === m) {
        matches.push(i); // index location match.
      }
    }

    if(i < n - m) {
      // move the rolling hash up.
      searchHash = (charSize * (searchHash -(searchspace.charCodeAt(i) * hash)) +
        searchspace.charCodeAt(i + m)
      ) % q;

      if(searchHash < 0) {
        searchHash = searchHash + q;
      }
    }
    i++;
  }
  return matches;
}

export default RabinKarp;

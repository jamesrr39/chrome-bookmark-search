# Multi-word search

Building on from the filter functionality, we will look here at better word search.

Filtering is useful for narrowing down a set of results but quickly runs into trouble when the exact filter term is not met.

To get around this, we will need a better search tool. This tool should provide a weight for each result, which should be used in the filtering and ordering of search results.

The emphasiser will also need to be updated.

https://www.elastic.co/guide/en/elasticsearch/guide/current/pluggable-similarites.html

## User Stories

todo

## Requirements

- Must be purely in-browser (no server)

## Options

- Roll our own
- [Elastic Search](https://github.com/elastic/bower-elasticsearch-js)
- [lunr.js](http://lunrjs.com/)
- [Elasticlunr.js](http://elasticlunr.com/)

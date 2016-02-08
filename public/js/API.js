var API = new(function() {
  var DEBUG = true;
  var CACHE = {};
  var CACHE_UPDATE = null;
  var CACHE_MAP = [
    'party'
  ];

  var HOST = 'http://opener.ee/api/v1/';

  function get(path, cb, nocache) {
    if (CACHE.hasOwnProperty(path) && !nocache) {
      cb(CACHE[path]);
    } else {
      $.get(HOST + path, function(data) {
        cb(data);
      });
    }
  }

  function loadCache() {
    async.each(CACHE_MAP, function(path, callback) {
      get(path, function(data) {
        CACHE[path] = data;
      }, true);
      callback();
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Preloaded cache for API paths : ' + CACHE_MAP);
        CACHE_UPDATE = new Date().getTime();
      }
    });
  }

  function getPartyMemberCounts(cb){
    get('party', function(data){
      cb(data);
    });
  }

  return {
    get: get,
    getPartyMemberCounts : getPartyMemberCounts,
    loadCache: loadCache,
    CACHE: CACHE
  };
});
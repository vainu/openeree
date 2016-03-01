var API = new(function() {
  var DEBUG = true;
  var CACHE = {};
  var CACHE_UPDATE = null;
  var CACHE_MAP = [
    'party'
  ];

  var HOST = 'http://opener.ee/api/v1/';

  function get(path, cb, nocache) {
    App.loader.show();
    if (CACHE.hasOwnProperty(path) && !nocache) {
      cb(CACHE[path]);
      App.loader.hide();
    } else {
      $.get(HOST + path, function(data) {
        cb(data);
        App.loader.hide();
      });
    }
  }

  function getSearch(search, cb) {
    $.when(
        $.get(HOST + 'party?search=name:'+ search),
        $.get(HOST + 'person?search=full_name:'+ search),
        $.get(HOST + 'company?search=name:'+ search)
    ).then(function (parties, persons, companies) {
        cb(null, parties, persons, companies);
    }, function (err) {
        cb(err);
    });
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

  var procurements = {
    getById : function(id, cb){
      get('procurement/' + id, function(data){
        cb(data);
      });
    },
    getTopWinners : function(cb){
      get('aggregated/mostprocsto?order=-total_amount', function(data){
        cb(data);
      });
    },
    getTopProcurers : function(cb){
      get('aggregated/mostprocsby?order=-total_amount', function(data){
        cb(data);
      })
    }
  }

  var company = {
    getById : function(id, cb){
      get('company/'+id+'/full', function(data){
        cb(data);
      });
    }
  }

  var person = {
    getById : function(id, cb){
      get('person/'+id+'/full', function(data){
        data.donations.sort(sort_by('year',true,parseInt));
        cb(data);
      })
    }
  }

  var party = {
    getColors : function(cb){
      var output = {};
      get('/party', function(data){
        async.each(data, function(party, callback){
          output[party.id] = {
            color : party.metadata.color,
            name : party.name
          };
          callback();
        }, function(){
          cb(output);
        })
      });
    },
    getAll : function(cb){
      get('/party', function(data){
        cb(data);
      });
    },
    getById : function(id, cb){
      get('/party/' + id, function(data){
        cb(data);
      })
    },
    getMembers : function(id, cb, limit){
      if(typeof limit === 'undefined'){
        limit = 100;
      }
      get('/party/' + id + '/members?limit='+limit, function(data){
        cb(data);
      });
    }
  }

  var donators = {
    getTop : function(cb){
      get('/', function(data){
        cb(data);
      });
    },
    byParty : function(id, cb, limit){
      if(typeof limit === 'undefined'){
        limit = 100;
      }
      get('party/'+id+'/donations/sum?order=-total_amount&limit=' + limit, function(data){
        cb(data);
      })
    }
  }

  return {
    get: get,
    getSearch: getSearch,
    procurements : procurements,
    company : company,
    person : person,
    party : party,
    donators : donators,
    getPartyMemberCounts : getPartyMemberCounts,
    loadCache: loadCache,
    CACHE: CACHE
  };
});
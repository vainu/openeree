var Router = prouter.Router;

Router.setAnchorHandlers = function() {
  $('#appWrap a').each(function() {
    if (!$(this).attr('href').match('http')) {
      $(this).attr('href', '#' + $(this).attr('href'));
    }
  });
}

Router.use('/', function(req) {
  Renderer.render('landing', req, {});
});

Router.use('/info', function(req) {
  Renderer.render('info', req, {});
});

Router.use('/procurements/topWinners', function(req){
  API.procurements.getTopWinners(function(data){
    Renderer.render('topProcWinners', req, {procurements : data});
  })
});

Router.use('/procurements/topProcurers', function(req){
  API.procurements.getTopProcurers(function(data){
    Renderer.render('topProcurers', req, {procurements : data});
  })
})

Router.use('/procurements/:id', function(req){
  API.procurements.getById(req.params.id, function(data){
    Renderer.render('procurementView', req, {procurement : data});
  })
})

Router.use('/company/:id', function(req){
  API.company.getById(req.params.id, function(data){
    Renderer.render('companyView',req,{company : data});
  })
});

Router.use('/person/:id', function(req){
  API.person.getById(req.params.id, function(data){
    Renderer.render('personView', req, {person : data});
  })
});

Router.use('/parties', function(req){
  API.party.getAll(function(data){
    Renderer.render('partyList', req, {parties : data}, function(){
      Graph.parties.fundingsAndFees();
      Graph.parties.partiesMembers();
    });
  });
});

Router.use('/party/:id', function(req){

  async.parallel({
    party : function(cb){
      API.party.getById(req.params.id, function(data){
        cb(null, data);
      });
    },
    donators : function(cb){
      API.donators.byParty(req.params.id, function(data){
        cb(null, data);
      },10000);
    },
    members : function(cb){
      API.party.getMembers(req.params.id, function(data){
        cb(null, data);
      },20000);
    }
  }, function(err, result){
    Renderer.render('partyView', req, {party : result.party, donators : result.donators, members : result.members}, function(){
      Graph.parties.fundingsAndFeesById(result.party.id);
    });
  })
});

Router.use('/donators/top', function(req){
  API.donators.getTop(function(data){
    Renderer.render('topDonators', req, {donators : data});
  })
});

Router.use('/search/:search', function (req) {
  API.getSearch(req.params.search, function (err, parties, persons, companies) {
    if (err) {
      console.error(err);
    }

    console.log('Search results', {
      'parties': parties[0],
      'persons': persons[0],
      'companies': companies[0]
    });
    Renderer.render('search', req, {parties : parties[0], persons : persons[0], companies : companies[0]});
    $('input[name="search"]').attr('placeholder',req.params.search);
  })
});

Router.use('*', function(req) {
  Renderer.render('404', req,{});
});

$(function() {
  Router.listen({
    root: '/',
    hashChange: true,
    silent: false
  });
})
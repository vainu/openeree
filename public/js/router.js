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
    Renderer.render('partyList', req, {parties : data});
  });
})

Router.use('/party/:id', function(req){
  API.party.getById(req.params.id, function(data){
    API.donators.byParty(req.params.id, function(donators){
      Renderer.render('partyView', req, {party : data, donators : donators});
    });
  })
})

Router.use('/donators/top', function(req){
  API.donators.getTop(function(data){
    Renderer.render('topDonators', req, {donators : data});
  })
})

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
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
  API.getPartyMemberCounts(function(data){
    App.drawTopMembersChart(data);
    App.drawTopFundingChart(data);
    App.drawFundingMemberFeeChart(data);
  });
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
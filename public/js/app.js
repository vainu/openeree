var App = new(function(){
	function init(){
		
	}

	function drawTopMembersChart(data){
		google.charts.load('current', {packages: ['corechart', 'bar']});
		
		//modify data
		var graphData = [];
		graphData.push(['Party','2015 Members',{ role: 'style' }]);
		async.each(data, function(party, callback){
			graphData.push([party.name, party.member_count,'fill-color:' + party.color]);
			callback();
		}, function(err){			
			google.charts.setOnLoadCallback(function(){
				var data = google.visualization.arrayToDataTable(graphData);
				console.log('DRAWING');
				var options = {
			        title: 'Party Members',
			        chartArea: {width: '50%'},
			        hAxis: {
			          title: 'Total Members',
			          minValue: 0
			        },
			        vAxis: {
			          title: 'Party'
			        }
			      };

				var chart = new google.visualization.BarChart(document.getElementById('members_top_chart'));
      			chart.draw(data, options);
			});

		});

	}

	function drawTopFundingChart(data){
		
		
		//modify data
		var graphData = [];
		graphData.push(['Funding','2015',{ role: 'style' }]);
		async.each(data, function(party, callback){
			graphData.push([party.name, party.gov_funding,'fill-color:' + party.color]);
			callback();
		}, function(err){			
			google.charts.setOnLoadCallback(function(){
				var data = google.visualization.arrayToDataTable(graphData);
				console.log('DRAWING');
				var options = {
			        title: 'Government Funding',
			        chartArea: {width: '50%'},
			        hAxis: {
			          title: 'Funding',
			          minValue: 0
			        },
			        vAxis: {
			          title: 'Party'
			        }
			      };

				var chart = new google.visualization.BarChart(document.getElementById('top_funding_chart'));
      			chart.draw(data, options);
			});

		});
	}

	function drawFundingMemberFeeChart(data){
		//modify data
		var graphData = [];
		graphData.push(['Party','Government Funding','Member Fee','Donations']);
		async.each(data, function(party, callback){
			graphData.push([party.name, party.gov_funding,party.member_fee,party.donation_sum]);
			callback();
		}, function(err){			
			google.charts.setOnLoadCallback(function(){
				var data = google.visualization.arrayToDataTable(graphData);
				console.log('DRAWING');
				var options = {
			        title: 'Government Funding, Member fee & Donations',
			        chartArea: {width: '50%'},
			        hAxis: {
			          title: '',
			          minValue: 0
			        },
			        vAxis: {
			          title: 'Party'
			        }
			      };

				var chart = new google.visualization.BarChart(document.getElementById('donation_funding_chart'));
      			chart.draw(data, options);
			});

		});
	}

	return {
		drawTopMembersChart : drawTopMembersChart,
		drawTopFundingChart : drawTopFundingChart,
		drawFundingMemberFeeChart : drawFundingMemberFeeChart,
		init : init
	}
});




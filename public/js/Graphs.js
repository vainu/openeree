var Graph = new (function(){
	var parties = {
		fundingsAndFees : function(){
			var graphData = [['Erakond', 'Riiklikud annetused','Liikmemaks','Annetused']];
			API.get('/party', function(data){
				async.each(data, function(party, cb){
					var output = [party.name, parseInt(party.metadata.gov_funding), parseInt(party.metadata.member_fee), parseInt(party.metadata.donation_sum)];
					graphData.push(output);
					cb();
				}, function(){
					var options = {
			          chart: {
			            title: 'Erakondade rahastus (2015)',
			            subtitle: ''
			          },		          
			          bars: 'horizontal'
			        };

			        var chart = new google.charts.Bar(document.getElementById('fundingAndFees'));
			        var data = google.visualization.arrayToDataTable(graphData);
        			chart.draw(data, options);

				});
			});
		},
		fundingsAndFeesById : function(partyId){
			API.get('/party/' + partyId, function(data){
				console.log(data);
				var options = {
					chart : {
						title : 'Erakonna rahastus (2015)'
					},
					bars : 'horizontal'
				};
				var chart = new google.charts.Bar(document.getElementById('fundingFeesById'));
				var data = google.visualization.arrayToDataTable([
						['','Riiklikud annetused', 'Liikmemaks', 'Annetused'],
						[data.name,parseInt(data.metadata.gov_funding),parseInt(data.metadata.member_fee), parseInt(data.metadata.donation_sum)]
					]);
				chart.draw(data, options);
			});
		},
		partiesMembers : function(){
			var graphData = [['Erakond', 'Liikmete arv']];
			API.get('/party', function(data){
				async.each(data, function(party, cb){
					var output = [party.name, parseInt(party.metadata.member_count)];
					graphData.push(output);
					cb();
				}, function(){
					var options = {
						chart : {
							title : 'Erakondade liikmed (2015)'
						},
						bars : 'horizontal'
					}
					var chart = new google.charts.Bar(document.getElementById('partiesMembers'));
			        var data = google.visualization.arrayToDataTable(graphData);
        			chart.draw(data, options);
				});
			})
		}
	}

	return {
		parties : parties
	}

});
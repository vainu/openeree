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
				  hAxis: {
				    titleTextStyle: {color: '#607d8b'}, 
				    gridlines: { count:0}, 
				    textStyle: { color: '#b0bec5', fontName: 'Roboto', fontSize: '12', bold: true}
				  },
				  vAxis: {
				    minValue: 0, 
				    gridlines: {color:'#37474f', count:4}, 
				    baselineColor: 'transparent'
				  },
				  legend: {position: 'top', alignment: 'center', textStyle: {color:'#607d8b', fontName: 'Roboto', fontSize: '12'} },
				  colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39"],
				  areaOpacity: 0.24,
				  lineWidth: 1,
				  backgroundColor: 'transparent',
				  chartArea: {
				    backgroundColor: "transparent",
				    width: '100%',
				    height: '80%'
				  },
				      height:200, // example height, to make the demo charts equal size
				      width:400,
				      pieSliceBorderColor: '#263238',
				      pieSliceTextStyle:  {color:'#607d8b' },
				      pieHole: 0.9,
				      bar: {groupWidth: "40" },
				      colorAxis: {colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4"] },
				      backgroundColor: 'transparent',
				      datalessRegionColor: '#37474f',
				      displayMode: 'regions'
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
				  hAxis: {
				    titleTextStyle: {color: '#607d8b'}, 
				    gridlines: { count:0}, 
				    textStyle: { color: '#b0bec5', fontName: 'Roboto', fontSize: '12', bold: true}
				  },
				  vAxis: {
				    minValue: 0, 
				    gridlines: {color:'#37474f', count:4}, 
				    baselineColor: 'transparent'
				  },
				  legend: {position: 'top', alignment: 'center', textStyle: {color:'#607d8b', fontName: 'Roboto', fontSize: '12'} },
				  colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39"],
				  areaOpacity: 0.24,
				  lineWidth: 1,
				  backgroundColor: 'transparent',
				  chartArea: {
				    backgroundColor: "transparent",
				    width: '100%',
				    height: '80%'
				  },
				      height:200, // example height, to make the demo charts equal size
				      width:400,
				      pieSliceBorderColor: '#263238',
				      pieSliceTextStyle:  {color:'#607d8b' },
				      pieHole: 0.9,
				      bar: {groupWidth: "40" },
				      colorAxis: {colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4"] },
				      backgroundColor: 'transparent',
				      datalessRegionColor: '#37474f',
				      displayMode: 'regions'
				    };

				var chart = new google.visualization.BarChart(document.getElementById('top_funding_chart'));
      			chart.draw(data, options);
			});

		});
	}

	function drawFundingMemberFeeChart(data){
		//modify data
		var graphData = [];
		graphData.push(['Party','Goverment Funding','Member Fee','Donations']);
		async.each(data, function(party, callback){
			graphData.push([party.name, party.gov_funding,party.member_fee,party.donation_sum]);
			callback();
		}, function(err){			
			google.charts.setOnLoadCallback(function(){
				var data = google.visualization.arrayToDataTable(graphData);
				console.log('DRAWING');
				var options = {
				  hAxis: {
				    titleTextStyle: {color: '#607d8b'}, 
				    gridlines: { count:0}, 
				    textStyle: { color: '#b0bec5', fontName: 'Roboto', fontSize: '12', bold: true}
				  },
				  vAxis: {
				    minValue: 0, 
				    gridlines: {color:'#37474f', count:4}, 
				    baselineColor: 'transparent'
				  },
				  legend: {position: 'top', alignment: 'center', textStyle: {color:'#607d8b', fontName: 'Roboto', fontSize: '12'} },
				  colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39"],
				  areaOpacity: 0.24,
				  lineWidth: 1,
				  backgroundColor: 'transparent',
				  chartArea: {
				    backgroundColor: "transparent",
				    width: '100%',
				    height: '80%'
				  },
				      height:200, // example height, to make the demo charts equal size
				      width:400,
				      pieSliceBorderColor: '#263238',
				      pieSliceTextStyle:  {color:'#607d8b' },
				      pieHole: 0.9,
				      bar: {groupWidth: "40" },
				      colorAxis: {colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4"] },
				      backgroundColor: 'transparent',
				      datalessRegionColor: '#37474f',
				      displayMode: 'regions'
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




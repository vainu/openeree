var App = new(function(){
	function init(){
		formatNumbers();
		setSearch();
	}

	function formatNumbers(){
		$('span.amount').each(function(){
			var val = parseInt($(this).html());
			$(this).html(val.formatMoney(3,' ',' ') + '€');
		});
	}

	function setSearch(){
		$('.init-search').click(function(){
			var keyword = $(this).parent().find('input[name="search"]').val();
			console.log(keyword);
			doSearch(keyword);
		});

		$('input[name="search"]').keyup(function(e){
			if(e.keyCode === 13){
				doSearch($(this).val());
			}
		})
	}

	function doSearch(keyword){
		if(keyword.length){
			window.location.hash = '#/search/' + keyword;
		}
	}

	return {
		init : init
	}
});

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };


var Renderer = new (function(){
	var templatePath = './templates/';
	function render(template, req, data){
		EJS.cache = false;
		var html = new EJS({url : templatePath + template + '.ejs'}).render(data);
		document.getElementById('appWrap').innerHTML = html;
		Router.setAnchorHandlers();
		$(document).foundation();
		$(document).scrollTop(0);
		App.init();
	}

	return {
		render : render
	}
});

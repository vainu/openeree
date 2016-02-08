!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t(require,exports,module):e.prouter=t()}(this,function(e,t,r){var n;return function(e){var t="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global,r=/^\/+|\/+$/,n=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g"),a=/.*/,o={hashChange:!0,usePushState:!1,root:"/",silent:!1},s=function(){function e(){}return e.parseQuery=function(e){var t={};"?"===e.charAt(0)&&(e=e.slice(1));for(var r=e.split("&"),n=0;n<r.length;n++){var a=r[n].split("=");t[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return t},e.parsePath=function(r){var n;"function"==typeof t.URL?n=new t.URL(r,"http://example.com"):(n=document.createElement("a"),n.href="http://example.com/"+r);var a={path:e.clearSlashes(n.pathname),query:e.parseQuery(n.search),queryString:n.search};return a},e.ensureSlashes=function(e){return"/"===e?e:("/"!==e.charAt(0)&&(e="/"+e),"/"!==e.charAt(e.length-1)&&(e+="/"),e)},e.escapeString=function(e){return e.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")},e._escapeGroup=function(e){return e.replace(/([=!:$\/()])/g,"\\$1")},e.clearSlashes=function(e){return e.replace(r,"")},e._flags=function(e){return e.sensitive?"":"i"},e._parse=function(t){for(var r,a=[],o=0,s=0,i="";r=n.exec(t);){var u=r[0],h=r[1],l=r.index;if(i+=t.slice(s,l),s=l+u.length,h)i+=h[1];else{i&&(a.push(i),i="");var c=r[2],p=r[3],f=r[4],d=r[5],v=r[6],g=r[7],_="+"===v||"*"===v,x="?"===v||"*"===v,y=c||"/",m=f||d||(g?".*":"[^"+y+"]+?");a.push({name:p||(o++).toString(),prefix:c||"",delimiter:y,optional:x,repeat:_,pattern:e._escapeGroup(m)})}}return s<t.length&&(i+=t.substr(s)),i&&a.push(i),a},e._tokensToPathExp=function(t,r){void 0===r&&(r={});for(var n=r.strict,a=r.end!==!1,o="",s=t[t.length-1],i="string"==typeof s&&s.length&&"/"===s.charAt(s.length-1),u=0;u<t.length;u++){var h=t[u];if("string"==typeof h)o+=e.escapeString(h);else{var l=e.escapeString(h.prefix),c=h.pattern;h.repeat&&(c+="(?:"+l+c+")*"),c=h.optional?l?"(?:"+l+"("+c+"))?":"("+c+")?":l+"("+c+")",o+=c}}return n||(o=(i?o.slice(0,-2):o)+"(?:\\/(?=$))?"),o+=a?"$":n&&i?"":"(?=\\/|$)",new RegExp("^"+o,e._flags(r))},e.stringToPathExp=function(t,r){var n=e._parse(t),a=e._tokensToPathExp(n,r);a.keys=[];for(var o=0;o<n.length;o++)"string"!=typeof n[o]&&a.keys.push(n[o]);return a},e}(),i=function(){function e(){}return e.listen=function(r){if(void 0===r&&(r={}),void 0!==e._root&&null!==e._root)throw new Error("Router already listening.");for(var n in o)void 0===r[n]&&(r[n]=o[n]);return e._wantsHashChange=r.hashChange,e._usePushState=r.usePushState&&!(!t.history||!t.history.pushState),e._root=s.ensureSlashes(r.root),e._usePushState?addEventListener("popstate",e.heedCurrent,!1):e._wantsHashChange&&addEventListener("hashchange",e.heedCurrent,!1),r.silent||e.heedCurrent(),e},e.stop=function(){removeEventListener("popstate",e.heedCurrent,!1),removeEventListener("hashchange",e.heedCurrent,!1);for(var t in e)e.hasOwnProperty(t)&&"function"!=typeof e[t]&&(e[t]=null);return e._handlers=[],e},e.getCurrent=function(){var t;if(e._usePushState||!e._wantsHashChange)t=decodeURI(location.pathname+location.search),t=t.slice(e._root.length);else{var r=location.href.match(/#(.*)$/);t=r?r[1]:""}return t=s.clearSlashes(t)},e.use=function(t,r){if(r instanceof u||t instanceof u){var n;t instanceof u?r=t:n=s.clearSlashes(t),e._handlers=e._extractHandlers(n,r,e._handlers)}else{var o;"function"==typeof t?(r=t,o=a):(t=s.clearSlashes(t),o=s.stringToPathExp(t)),e._handlers.push({pathExp:o,activate:r})}return e},e.navigate=function(t){if(void 0===e._root||null===e._root)throw new Error("It is required to call the 'listen' function before navigating.");if(t=s.clearSlashes(t),e._usePushState)history.pushState(null,null,e._root+t);else{if(!e._wantsHashChange)return location.assign(e._root+t),e;location.hash="#"+t}return e.load(t)},e.heedCurrent=function(){var t=e.getCurrent();return t===e._loadedPath?e:e.load(t)},e.load=function(t){function r(){if(!(a>=n.length)){var t=n[a];a++,t.request.oldPath=e._loadedPath;var o=t.activate.call(null,t.request,r);o===!0&&(console&&console.log&&console.log('"return true" is deprecated, use "next()" instead.'),r())}}var n=e._obtainRequestProcessors(t);if(n.length){var a=0;r()}return e._loadedPath=t,e},e._extractHandlers=function(e,t,r){void 0===r&&(r=[]);for(var n=t._handlers,o=0;o<n.length;o++){var i=n[o],u=void 0,h=void 0;"function"==typeof i.path?h=i.path:(h=i.activate,u=s.clearSlashes(i.path));var l=void 0;if(void 0===e||void 0===u)l=void 0===e&&void 0===u?a:s.stringToPathExp(void 0===e?u:e);else{var c=e+"/"+u;l=s.stringToPathExp(c)}r.push({pathExp:l,activate:h})}return r},e._obtainRequestProcessors=function(t){for(var r=s.parsePath(t),n=[],a=0;a<e._handlers.length;a++){var o=e._handlers[a],i=o.pathExp.test(r.path);if(i){var u=e._extractRequest(t,o.pathExp);n.push({activate:o.activate,request:u})}}return n},e._extractRequest=function(e,t){var r=s.parsePath(e);r.params={};for(var n=t.exec(r.path),a=n.slice(1),o=t.keys,i=0;i<a.length;i++)void 0!==a[i]&&(r.params[o[i].name]=decodeURIComponent(a[i]));return r},e._handlers=[],e}();e.Router=i;var u=function(){function e(){this._handlers=[]}return e.prototype.use=function(e,t){return this._handlers.push({path:e,activate:t}),this},e}();e.RouteGroup=u}(n||(n={})),n});
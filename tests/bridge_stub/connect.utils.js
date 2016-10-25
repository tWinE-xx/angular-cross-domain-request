(function(){
    window.connect = window.connect || {};
    window.connect.utils = window.connect.utils || {};
    /*
    var options = {
        url: 'www.domain.com/api',
        type: 'GET',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }
    */
    window.connect.utils.xhr = function(options, cb){
        //create cross browser request
        var request;
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            try {
                request = new ActiveXObject('Msxml2.XMLHTTP');
            } 
            catch (e) {
                try {
                    request = new ActiveXObject('Microsoft.XMLHTTP');
                } 
                catch (e) {
                    window.connect.utils.handleError('could not create xhr request '+e);
                }
            }
        }
        //make request
        request.open(options.type, options.url, true);
        //set headers
        //TODO - check how to send headers in IE
        if (request.setRequestHeader){
            for (var key in Object.keys(options)) {
                request.setRequestHeader(key, options[key]);
            }
        }
        //fire
        request.send(JSON.stringify(options.data));
        //request callbacks
        // state changes
        request.onreadystatechange = function() {
            if(request.readyState === 4) { // done
                if(request.status === 200) { // complete	
                    return cb(null, JSON.parse(request.responseText));
                } else {
                    window.connect.utils.handleError(e);          
                    return cb(e, null);
                }
            }
        };
    }
    //
    window.connect.utils.loadFrame = function(url, cb){
        var iframe = document.createElement('iframe');
        //iframe.style.display = "none";
        iframe.onload = function(a,b) {
            //clear iframe creation timeout
            clearTimeout(errorTimeout);
            return cb(this);
        }; 
        iframe.src = url; 
        iframe.id = 'connect-iframe';
        iframe.style = 'display:none;'
        document.body.appendChild(iframe);
        //wait 5 sec to load iframe
        var errorTimeout = setTimeout(function(){
            return cb(null);
        },5000)
    }
    //
    window.connect.utils.handleError = function(e){
        if (console && console.log) console.log(e);
        else alert(e);
    }
    //
    window.connect.utils.extractDomain = function(url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }
        return domain;
    }
    //
    window.connect.utils.extractProtocol = function(url) {
        var protocol;
        //find  protocol (http, ftp, etc.) 
        if (url.indexOf("://") > -1) {
            protocol = url.split('/')[0];
        }
        else {
            protocol = url.split('/')[0];
        }
        return protocol;
    }
    //
    window.connect.utils.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
     window.connect.utils.queue = {
         state: [],
         add: function (item){
             this.state.push(item);
         },
         pop: function(prop, val){
             for (var i=0;i<this.state.length;i++){
                 if (this.state[i][prop] == val){
                     var itemToReturn = this.state[i];
                     this.state.splice(i,1);
                     return itemToReturn;
                 }
             }
         }
     }
})();

if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}
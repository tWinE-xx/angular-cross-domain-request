(function(){
    //
    window.connect.client = window.connect.client || {};
    window.connect.client.debug = true;
    window.connect.client.doRequest = doRequest;
    window.connect.client.iframe = null;
    //load iframe on init
    window.connect.client.init = function(iframeLocationUrl, cb){
        if (!window.connect.client.iframe){           
            var frameUrl = iframeLocationUrl+'/bridge.html';
            window.connect.utils.loadFrame(frameUrl, function(iframe){
                //check if loaded - not really working..
                if (!iframe) {
                    var err = 'could not load iframe from '+frameUrl;
                    window.connect.utils.handleError(err);
                    return cb(err, null);
                }
                window.connect.client.iframe = iframe;
                setTimeout(function(){
                    return cb(iframe);
                },1000);
            });
        } else {
            return cb(window.connect.client.iframe);
        }
    }
    // Create IE + others compatible event handler
    window.connect.client.eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    window.connect.client.messageEvent = window.connect.client.eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message returned by the bridge
    window.connect.client.listen = function(cb){
        window[window.connect.client.eventMethod](window.connect.client.messageEvent, receiveMessage, false);
        cb(null, window.connect.client.messageEvent, window.location.toString());
    }
    //start listening to requests returned by the bridge
    window.connect.client.listen(function(err, to, url){
        if (err) console.log('error, client can not listen to incoming request', err);
        else if (console && console.log && window.connect.client.debug) 
            console.log('client is listening to ', to,' on ', url);
    })
    //receive messages from bridge
    function receiveMessage(e){
        var data = JSON.parse(e.data);
        if (console && console.log && window.connect.client.debug) 
            console.log('client', 'receiveMessage', data);
        //console.log(window.connect.utils.queue.state); 
        //pop from queue
        var returnedOperation = window.connect.utils.queue.pop('guid', data.guid);
        //console.log(returnedOperation, window.connect.utils.queue.state);
        //run callck to client
        returnedOperation.cb(data.result.err, data.result.data);
    }
    //make requests to bridge
    function doRequest(options, cb){
        //validate options
        if (!options.url) 
            window.connect.utils.handleError('missing url in request options');
        if (!options.type) 
            window.connect.utils.handleError('missing type in request options');
        if (options.type.toUpperCase() != 'GET' && options.type.toLowerCase() != 'POST') 
            window.connect.utils.handleError(options.type+ ' is not supported request type, please use "GET" or "POST"');
        //cross domain call
        if (isCrossDomain(window.location.toString(), options.url))
            return postMessage(options, cb);//use post messaging
        else//not cross domain call
            return window.connect.utils.xhr(options, cb);//use xhr (same origin call)
    }
    //make post message requests to bridge
    function postMessage(options, cb){
        if (console && console.log && window.connect.client.debug) 
                console.log('client', 'postMessage', options);
        var origin = window.connect.utils.extractProtocol(options.url)+'//'+ window.connect.utils.extractDomain(options.url);
        var iframe = window.connect.client.iframe || window.document.getElementById('connect-iframe');
        var guid = window.connect.utils.guid();
        window.connect.utils.queue.add({guid: guid, cb:cb});
        var thisOrigin = window.connect.utils.extractProtocol(window.location.toString())+'//'+ window.connect.utils.extractDomain(window.location.toString());
        
        return iframe.contentWindow.postMessage(JSON.stringify({options: options, guid: guid, origin: thisOrigin}), origin);
    }
    //check if cross domain or not
    function isCrossDomain(source, target){
        return  window.connect.utils.extractDomain(source) ==  window.connect.utils.extractDomain(target) ? false : true;
    }
}());

var JSON = JSON || {};

// implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj) {

var t = typeof (obj);
if (t != "object" || obj === null) {

    // simple data type
    if (t == "string") obj = '"'+obj+'"';
    return String(obj);

}
else {

    // recurse array or object
    var n, v, json = [], arr = (obj && obj.constructor == Array);

    for (n in obj) {
        v = obj[n]; t = typeof(v);

        if (t == "string") v = '"'+v+'"';
        else if (t == "object" && v !== null) v = JSON.stringify(v);

        json.push((arr ? "" : '"' + n + '":') + String(v));
    }

    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
}
};

// implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str) {
if (str === "") str = '""';
eval("var p=" + str + ";");
return p;
 };

(function(){
    
    window.connect = window.connect || {};
    window.connect.bridge = window.connect.bridge || {};
    //
    window.connect.bridge.debug = true;
    // Create IE + others compatible event handler
    window.connect.bridge.eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    window.connect.bridge.messageEvent = window.connect.bridge.eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    window.connect.bridge.listen = function(cb){
        window[window.connect.bridge.eventMethod](window.connect.bridge.messageEvent, receiveMessage, false);
        cb(null, window.connect.bridge.messageEvent, window.location.toString());
    }
    //start listening
    window.connect.bridge.listen(function(err, to, url){
        if (err) console.log('error, bridge can not listen to incoming request', err);
        else if (console && console.log && window.connect.bridge.debug) 
            console.log('bridge is listening to ', to,' on ', url);
    })
    //receive messages from client
    function receiveMessage(e){
        var requestData = JSON.parse(e.data);
        if (console && console.log && window.connect.bridge.debug)
            console.log('bridge', 'receiveMessage', requestData);
        return window.connect.utils.xhr(requestData.options, function(err, data){
            requestData.result = {};
            requestData.result.err = err;
            requestData.result.data = data;            
            postMessage(requestData);
        });
    }
    //
    function postMessage(e){
        if (console && console.log && window.connect.bridge.debug)
            console.log('bridge', 'postMessage', e);        
        window.parent.postMessage(JSON.stringify(e), e.origin)
    }
}());

var JSON = JSON || {};

//implement JSON.stringify serialization
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

//implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str) {
if (str === "") str = '""';
eval("var p=" + str + ";");
return p;
};
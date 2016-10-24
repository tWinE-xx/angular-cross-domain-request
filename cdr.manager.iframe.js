(function(window, angular){
    //'use strict';
    
    angular.module('cdr')
        .factory('IframeManager', IframeManager);

    IframeManager.$inject = [];

    function IframeManager(){
        
        var factory = {
            bridge: null,
            register: register,
            postMessage: postMessage,
            receiveMessage: receiveMessage
        }
        
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventMethodRemove = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        function register(bridgePath, cb){
            var justDomainName = extractDomain(bridgePath);
            var iframeId = 'connect-iframe-'+justDomainName;            
            //check if current domian's iframe loaded already'
            var domainIframe = window.document.getElementById(iframeId);            
            if (domainIframe != null) {
                if (this.bridge == null) this.bridge = domainIframe; 
                return cb(domainIframe);
            }
            //clear old event listeners
            window[eventMethodRemove](messageEvent, receiveMessage);
            //load iframe
            var iframe = window.document.createElement('iframe');
            var self = this;
            iframe.onload = function(a,b) {
                //clear iframe creation timeout
                clearTimeout(errorTimeout);
                self.bridge = iframe;
                resiterReceiveMessageCallback(justDomainName);
                return cb(iframe);
            }; 
            iframe.src = bridgePath; 
            iframe.id = iframeId;
            iframe.style = 'display:none;'
            window.document.body.appendChild(iframe);
            //wait 5 sec to load iframe
            var errorTimeout = setTimeout(function(){
                return cb(null);
            },5000);
        }

        function postMessage(options, cb){
            if (this.bridge == null) return cb('postMessage: connector not initialized, please run init(bridgePath, callbackFn) function');
            if (console && console.log && window.http_polyfill_debug) 
                    console.log('client', 'postMessage', options);
            var origin = extractProtocol(options.url)+'//'+ extractDomain(options.url);
            if (!this.bridge || !this.bridge.contentWindow)
                return cb('postMessage: bridge is not loaded');
            var guid = createGuid();
            //debugger;
            queue.add({guid: guid, cb:cb});
            var thisOrigin = extractProtocol(window.location.toString())+'//'+ extractDomain(window.location.toString());
            return this.bridge.contentWindow.postMessage(JSON.stringify({options: options, guid: guid, origin: thisOrigin}), origin);
    
        }

        function receiveMessage(e){
            var data = JSON.parse(e.data);
            if (console && console.log && window.http_polyfill_debug) 
                console.log('client', 'receiveMessage', data);
            //pop from queue
            //debugger;
            var returnedOperation = queue.pop('guid', data.guid);
            //console.log(returnedOperation, window.connect.utils.queue.state);
            //run callck to client
            if (returnedOperation)
                returnedOperation.cb(data.result.err, data.result.data);
            else if (console && console.log)
                console.log('queue missing cb', data);
        }
        //
        var resiterReceiveMessageCallback = function(to, url){
            // Create IE + others compatible event handler
            // Listen to message returned by the bridge
            window[eventMethod](messageEvent, receiveMessage, false);
            if (console && console.log && window.http_polyfill_debug) 
                console.log('client is listening to ', to);
        }
        //
        var extractDomain = function(url) {
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
        var extractProtocol = function(url) {
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
        var createGuid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        var queue = {
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

        return factory;
    }
})(window, window.angular);
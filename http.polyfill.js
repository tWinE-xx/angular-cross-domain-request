
(function(window, angular) {
    'use strict';
    angular.module('http.polyfill')
        .service('HttpPolyfill', HttpPolyfill);

    HttpPolyfill.$inject = ['RequestBuilder', 'IframeManager']
    
    function HttpPolyfill(RequestBuilder, IframeManager) {
        
        var httpPolyfill = {
            init: init,
            get: get,
            post: post,
        };
        
        return httpPolyfill;

        function init(bridgePath, cb){
            IframeManager.register(bridgePath, cb);
        }
        function get(url, params, body, headers, cb){
            return doRequest('GET', url, params, body, headers, cb);
        }
        function post(url, params, body, headers, cb){
            return doRequest('POST', url, params, body, headers, cb);
        }
        function doRequest(verb, url, params, body, headers, cb){
            //debugger;
            if (IframeManager.bridge == null) return cb('connector not initialized, please run init(bridgePath, callbackFn) function');
                        
            var request = RequestBuilder.build(url, verb, params, body, headers);
            
            IframeManager.postMessage(request, cb);
            
        }
        
    };

})(window, window.angular);
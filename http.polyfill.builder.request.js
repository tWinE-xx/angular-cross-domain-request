(function(window, angular) {
    'use strict';
    angular.module('http.polyfill', [])
            .factory('RequestBuilder', RequestBuilder);
    
    RequestBuilder.$inject = [];

    function RequestBuilder(){
        var factory = {
            build: build
        }

        function build(url, verb, params, body, headers){
            return {
                url: url,
                type: verb,
                headers: headers,
                data: body
            }
        }

        return factory;
    }

})(window, window.angular);
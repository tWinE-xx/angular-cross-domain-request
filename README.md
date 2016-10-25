# angular-http-cross-domain-request
<p align="center">
    <a href="https://travis-ci.org/badges/shields">
        <img src="https://travis-ci.org/tWinE-xx/angular-cross-domain-request.svg?branch=master"
             alt="build status">
    </a>
</p>
An angular service enabling cross-domain ajax requests using iframe from other domain and post messaging API.

## Install
```
npm install angular-http-cross-domain-request
```

copy this files to your server's static files location:

$/tests/bridge_stub/bridge.html
$/tests/bridge_stub/connect.utils.js
$/tests/bridge_stub/connect.bridge.js

```
for example:
- TOMCAT Server - put these files in WEB-INF folder
- Express Server - put these files where js, html, css files are
```

## Usage
```js
angular
    .module('myAppModule', [cdr])
    .controller('MyAppController', MyAppController);

    MyAppController.$inject = ['$scope', 'CdrService'];

    function MyAppController($scope, CdrService){
        var bridgeUrl = 'http://localhost:8081/bridge.html';
        var apiUrl = 'http://localhost:8081/myApiFunction'
        CdrService.init(bridgeUrl, function(iframe){
            var urlParams = []
                bodyData = null,
                headers = {'Content-Type':'application/json', 'test': 'test'};
            
            CdrService.get(apiUrl, urlParams, bodyData, headers, function(err, data){
                if (err) //handle error
                //handle response
            });
        });
});
```

## API

### CdrService.init(bridgePath, callback)
<p>
** this function is mandatory before other functions can be used
</p>
<p>
this function appends the remote domain's iframe and set post messaging listeners
</p>

### CdrService.get(url, params, body, headers, cb){
<p>
this function makes a GET request to the remote API
</p>
<ul>
    <li>url: the remote API url</li>
    <li>params: data sent as request query params</li>
    <li>body: data sent in request body</li>
    <li>headers: json with all headers sent as request headers</li>
</ul>

### CdrService.post(url, params, body, headers, cb){
<p>
this function makes a POST request to the remote API
</p>
<ul>
    <li>url: the remote API url</li>
    <li>params: data sent as request query params</li>
    <li>body: data sent in request body</li>
    <li>headers: json with all headers sent as request headers</li>
</ul>


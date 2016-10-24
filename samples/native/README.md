# native sample

## Install
```
npm instal -g http-server
```

run 2 http servers to emulate cross domain requests:
open command line window
go to folder /samples/native
run command: http-server -p 8080

open another command line window 
go to folder: /samples/native
run command: http-server -p 8081

see results in broswer:
open browser and browse to http://localhost:8080

## Usage

```
*** copy bridge.html, connect.utils.js, connect.bridge.js to your server (request target)
```

```js
var baseApiUri = 'http://localhost:8081';
var optionsGet = {
    url: baseApiUri+'',
    type: 'GET',//or POST
    headers: {
        'Content-Type':'application/json'
    }
}
//init loades the iframe from the other domain and setup post messaging API 
window.connect.client.init(baseApiUri, function(iframe){
    //post message the iframe which makes a regular ajax request since has same domain
    window.connect.client.doRequest(optionsGet, function(err, data){
        //handle error
        if err (alert(err));
        //use response
        else alert(data);
    });
});
```

## API

### connect.client.init(iframeLocationUrl, cb)
##### -> loads other domains iframe
##### iframeLocationUrl: url to the bridge.html which if the iframe loaded
##### cb: callback(err, data) function with error and data

### connect.client.listen(cb)
##### -> sets spot messaging send recieve event in place
##### cb: callback(err, data) function with error and data






describe("CdrService", function() {
    
    var CdrService, IframeManager;
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    var $injector = angular.injector(['cdr']);
    CdrService = $injector.get('CdrService');
    if (typeof CdrService != typeof new Object) throw "could not load CdrService";
    IframeManager = $injector.get('IframeManager');
    if (typeof IframeManager != typeof new Object) throw "could not load IframeManager";

    beforeEach(function() {
        
    });
    
    it("should add iframe", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        IframeManager.register(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            expect( IframeManager.bridge ).not.toBe(null);
            done();
        })
    });
    
    it("should post and receive messages from other domain using get", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        
        IframeManager.register(url, function(iframe){
            //check
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            //create test post message data
            var baseApiUri = 'http://localhost:8081';
            var optionsGet = {
                url: baseApiUri+'',
                type: 'GET',
                headers: {
                    'Content-Type':'application/json'
                }
            }
            //
            IframeManager.postMessage(optionsGet, function(err, data){
                expect( err ).toEqual(null);
                expect( data ).not.toBe(null);
                expect( data ).not.toBe(undefined);
                expect( data.hello ).toEqual('get');
                done();
            });
        })
    });
    
    it("should post and receive messages from other domain using post", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        
        IframeManager.register(url, function(iframe){
            //check
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            //create test post message data
            var baseApiUri = 'http://localhost:8081';
            var optionsGet = {
                url: baseApiUri+'',
                type: 'POST',
                headers: {
                    'Content-Type':'application/json'
                }
            }
            //
            IframeManager.postMessage(optionsGet, function(err, data){
                expect( err ).toEqual(null);
                expect( data ).not.toBe(null);
                expect( data ).not.toBe(undefined);
                expect( data.hello ).toEqual('post');
                done();
            });
        })
    });
    
    it("should fail when init function not executed before get/post", function(done) {
        if (window.document.getElementById('connect-iframe-localhost:8081'))
            window.document.getElementById('connect-iframe-localhost:8081').remove();
        CdrService.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
            expect ( err ).toEqual( "postMessage: bridge is not loaded" );
            expect ( data ).toEqual( undefined );
            done();
        });
    });
    
    it("should init success", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        CdrService.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            done();
        })
    });
    
    it("should make get request from other domain", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        CdrService.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            CdrService.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                //debugger;
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('get');
                done();
            });
        })
    });
    
    it("should make post request from other domain", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        CdrService.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            CdrService.post('http://localhost:8081/', [], {some: "data"}, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('post');
                done();
            });
        })
    });
    
    it("should make post + get requests from other domain", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        CdrService.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            CdrService.post('http://localhost:8081/', [], {some: "data"}, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('post');
            });
            CdrService.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                //debugger;
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('get');
            });
        });
        setTimeout(function(){
            done();
        }, 2000);
    });
    
});
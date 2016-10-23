describe("IframeManager", function() {
    
    var IframeManager;
    
    beforeEach(function() {
        window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        var $injector = angular.injector(['http.polyfill']);
        IframeManager = $injector.get('IframeManager');
        expect( typeof IframeManager ).toEqual(typeof new Object);
    });
    
    it("should add iframe", function(done) {
        var url = 'http://localhost:8081/tests/bridge.html';
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
    
});
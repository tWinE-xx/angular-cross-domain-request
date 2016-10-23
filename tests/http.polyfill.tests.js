describe("HttpPolyfill", function() {
    
    var HttpPolyfill;
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    var $injector = angular.injector(['http.polyfill']);
    HttpPolyfill = $injector.get('HttpPolyfill');
    if (typeof HttpPolyfill != typeof new Object) throw "could not load HttpPolyfill";

    beforeEach(function() {
        
    });
    
    it("should fail when init function not executed before get/post", function(done) {
        HttpPolyfill.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
            expect ( err ).toEqual( "connector not initialized, please run init(bridgePath, callbackFn) function" );
            expect ( data ).toEqual( undefined );
            done();
        });
    });

    it("should init success", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        HttpPolyfill.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            done();
        })
    });
    
    it("should make get request from other domain", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        HttpPolyfill.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            HttpPolyfill.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
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
        HttpPolyfill.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            HttpPolyfill.post('http://localhost:8081/', [], {some: "data"}, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('post');
                done();
            });
        })
    });
    
    it("should make post + get requests from other domain", function(done) {
        var url = 'http://localhost:8081/bridge.html';
        HttpPolyfill.init(url, function(iframe){
            expect( typeof iframe ).toEqual(typeof new Object);
            expect( iframe.src ).toEqual(url);
            HttpPolyfill.post('http://localhost:8081/', [], {some: "data"}, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
                expect(data).not.toBe(null);
                expect(data).not.toBe(undefined);
                expect(data.hello).toEqual('post');
            });
            HttpPolyfill.get('http://localhost:8081/', [], null, {'Content-Type':'application/json', 'test': 'test'}, function(err, data){
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
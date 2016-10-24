// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_DEBUG,
    files: [
        'node_modules/angular/angular.js',
         //'dist/cdr.js',
        'cdr.module.js',
        'cdr.builder.request.js',
        'cdr.manager.iframe.js',
        'cdr.service.js',
        'tests/cdr.service.tests.js'
    ]
  });
};
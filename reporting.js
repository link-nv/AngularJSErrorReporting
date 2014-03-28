'use strict';

/**
 * Report angular errors to server. Based on http://www.bennadel.com/blog/2542-Logging-Client-Side-Errors-With-AngularJS-And-Stacktrace-js.htm
 *
 * Requires stacktrace.js and jQuery included on the page
 **/

var errorReportingModule = angular.module('errorReporting', []);

// wrapper around stacktrace.js
errorReportingModule.factory( 'stacktraceService', ['$log', function($log) {

        if (printStackTrace === undefined){
            $log.error('stacktrace.js was not found on this page');
        }

        // "printStackTrace" is a global object.
        return({
            print: printStackTrace
        });

    }]
);

// error reporting provider
errorReportingModule.provider('ErrorReport', [function () {

    this.reportUrl = '';

    this.$get = ['$log', '$window', 'stacktraceService',  function($log, $window, stacktraceService){

        var url = this.reportUrl;

        return {
            report: function( exception, cause ) {

                 // try and log the error the server.
                 try {

                    if(!url){
                        $log.error('Can\'t log error to server: reportUrl not set\n');
                        return;
                    }

                     var errorMessage = exception.toString();
                     var stackTrace = stacktraceService.print({ e: exception });
                     var userAgent = $window.navigator.userAgent;

                     // Log the JavaScript error to the server.
                     // using jQuery ajax call instead of AngularJS $http, due to circular dependencies ($http depends on $exceptionHandler)
                     $.ajax({
                         type: "POST",
                         url: url,
                         contentType: "application/json",
                         data: angular.toJson({
                             errorUrl: $window.location.href,
                             errorMessage: errorMessage,
                             stackTrace: stackTrace,
                             cause: ( cause || "" ),
                             userAgent: userAgent
                         })
                     });
                 } catch ( loggingError ) {
                     // For Developers - log the log-failure.
                     $log.warn( "Error logging failed" );
                     $log.log( loggingError );
                 }
            }
        }
    }]
}]);

// decorate default AngularJS exception handler
errorReportingModule.config(['$provide', function($provide) {
    $provide.decorator("$exceptionHandler", ['$delegate', 'ErrorReport', function($delegate, ErrorReport) {
        return function(exception, cause) {
            $delegate(exception, cause);
            ErrorReport.report(exception, cause);
        };
    }]);
}]);


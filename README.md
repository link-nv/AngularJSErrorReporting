AngularJSErrorReporting
=======================

Log client side errors with AngularJS. 
This module augments the default AngularJS exception handler by logging client-side errors serverside.

Requirements
------------

* jQuery
* [stacktrace.js](http://stacktracejs.com/)

Usage
-----
Include in your AngularJS app and configure the URL to POST exceptions to:

    myapp.config(['ErrorReportProvider', function(ErrorReportProvider){
        ErrorReportProvider.reportUrl = '<your_url>';
    }]);

Exceptions are submitted in JSON format:

    {
        errorUrl: "http://...",
        errorMessage: "some message",
        cause: "some cause",
        stackTrace: ["line1", "line2", "line3", ...]
    }
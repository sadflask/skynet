// ConsoleLogger for helping to log bot messages

// To use the ConsoleLogger add the following code at the top of your js file:
/*
var logger = require('./consolelogger')
*/

// The logger functions are:
/*
logMessage(message);
logError(err);
logRequest(req);
logObj(obj);
*/

CircularJSON = require('circular-json');

exports.logRequest = function logRequest(req) {

    console.log('========== START LOGGING REQUEST ==========');
    console.log('METHOD: ' + req.method);
    console.log('URL: ' + req.url);
    console.log('PARAMETERS:');
    console.log(req.params);
    console.log('BODY:');
    console.log(req.body);
    console.log('========== END   LOGGING REQUEST ==========');
};
exports.logMessage = function logMessage(message) {

    console.log('========== START LOGGING MESSAGE ==========');
    console.log(message);
    console.log('=========== END LOGGING MESSAGE ===========');
};

exports.logObj = function logobj(obj) {

    console.log('========== START LOGGING OBJECT ==========');
    console.log(CircularJSON.stringify(obj));

    console.log('=========== END LOGGING OBJECT ===========');
};

exports.logError = function logError(err) {

    console.log('========== START LOGGING ERROR ==========');
    console.log(err);
    console.log('=========== END LOGGING ERROR ===========');
};

// ConsoleLogger for helping to log bot messages

// To use the ConsoleLogger add the following code at the top of your js file:
/*
var logger = require('./consolelogger')
*/

// The logger functions are:
/*
logMessage(message);
logError(err);
*/

exports.logMessage = function logMessage(message) {

    console.log('========== START LOGGING MESSAGE ==========');
    console.log(message);
    console.log('=========== END LOGGING MESSAGE ===========');
};

exports.logObj = function logobj(obj) {

    console.log('========== START LOGGING OBJECT ==========');
    console.log(JSON.stringify(obj));

    console.log('=========== END LOGGING OBJECT ===========');
};

exports.logError = function logError(err) {

    console.log('========== START LOGGING ERROR ==========');
    console.log(err);
    console.log('=========== END LOGGING ERROR ===========');
};

"use strict";
var forever = require('forever-monitor');
var child = new(forever.Monitor)('bot.js', {
    'silent': false,
    'pidFile': 'pids/app.pid',

    'command': 'node --harmony',


    'watch': true,
    'watchDirectory': '.', // Top-level directory to watch from.
    'watchIgnoreDotFiles': true, // whether to ignore dot files
    'watchIgnorePatterns': [''], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file


    'logFile': 'logs/forever.log', // Path to log output from forever process (when daemonized)
    'outFile': 'logs/forever.out', // Path to log output from child stdout
    'errFile': 'logs/forever.err'
});
child.start();
// forever.startServer(child);
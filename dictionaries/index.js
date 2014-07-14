var loader = require('../helpers/loadDirectory.js');

module.exports = loader(__dirname, {
    currentDir: __dirname,
    type: '.js',
    recursive: true
});
var rek = require('rekuire'),
    loader = rek('helpers/loadDirectory.js');

module.exports = loader(__dirname, {
    currentDir: __dirname,
    type: '.txt',
    recursive: true,
    require: false
});

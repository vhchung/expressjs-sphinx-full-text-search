var SphinxClient = require ("sphinxapi");
var cl = new SphinxClient();
cl.SetServer('localhost', 9312);

module.exports = cl;

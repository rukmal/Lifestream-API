var request = require('request');
var exports = module.exports;
var Dropbox = require('dropbox');
var client = new Dropbox.Client({
	key: 'rgttjufb5xlchf3',
	secret: '4vaaj551yczkhty'
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191, './package.json'));
client.authenticate(function(error, client) {
	if (error) {
		console.log(error);
	}
	console.log(client);
});
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

var app = express();

// all environments
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());

var router = express.Router();

router.get('/', function (req, res) {
	res.send('hello world');
});

app.use('/', router);
var port = process.env.PORT || 80;
app.listen(port);
console.log('Express server listening on port ' + port);
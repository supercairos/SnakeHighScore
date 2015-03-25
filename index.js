var pg = require('pg')
var express = require('express')
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')

var cool = require('cool-ascii-faces')

var app = express()
app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 
	extended: true 
}));

// parse application/json
app.use(bodyParser.json());

app.get('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 5;', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result.rows);
			}
		});
	});
})

app.post('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('INSERT INTO highscores (uuid, name, score, timestamp) VALUES($1, $2, $3, $4) RETURNING id;', [request.body.uuid, request.body.name, request.body.score, new Date()], function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result);
			}
		});
	});
})

app.get('/', function (req, res) {
	res.send(cool())
})

var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
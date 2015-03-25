var pg = require('pg')
var express = require('express')
var cool = require('cool-ascii-faces')

var app = express()
app.set('port', (process.env.PORT || 5000))

app.get('/setup_database', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('CREATE TABLE IF NOT EXISTS highscores (id serial PRIMARY KEY NOT NULL, uuid VARCHAR(255) UNIQUE NOT NULL, name VARCHAR (50) UNIQUE NOT NULL, score integer NOT NULL, timestamp TIMESTAMP)', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result);
			}
		});
	});
})

app.get('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM highscore ORDER BY score DESC LIMIT 5;', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result.rows);
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
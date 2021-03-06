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

app.get('/setup_database', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('CREATE TABLE IF NOT EXISTS highscores (id serial PRIMARY KEY NOT NULL, uuid VARCHAR(255) NOT NULL, name VARCHAR (255) NOT NULL, score integer NOT NULL, timestamp TIMESTAMP)', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result);
			}
		});
	});
})

app.get('/drop_table', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('DROP TABLE highscores;', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result);
			}
		});
	});
})

app.get('/truncate', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('TRUNCATE highscores;', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			} else { 
				response.send(result);
			}
		});
	});
})

app.get('/all_highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM highscores ORDER BY score DESC;', function(err, result) {
			done();
			if (err){ 
				console.error(err); 
				response.status(500).send("Error " + err);
			} else { 
				response.send(result.rows);
			}
		});
	});
})

app.get('/uuid_highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT id FROM highscores WHERE uuid = $1 AND name = $2;', ["uuid", "Romain Caire"], function(err, result) {
			done();
			if (err){ 
				console.error(err); 
				response.status(500).send("Error " + err);
			} else { 
				response.send(result.rows);
			}
		});
	});
})

app.get('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM highscores ORDER BY score DESC LIMIT 5;', function(err, result) {
			done();
			if (err){ 
				console.error(err); 
				response.status(500).send("Error " + err);
			} else { 
				response.send(result.rows);
			}
		});
	});
})

app.post('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT id FROM highscores WHERE uuid = $1 AND name = $2;', [request.body.uuid, request.body.name], function(err, result) {
			if(typeof result.rows !== 'undefined' && result.rows.length > 0) {
				client.query('UPDATE highscores SET score = $1, timestamp = $2 WHERE id = $3 AND uuid = $4 RETURNING *;', [request.body.score, new Date(), result.rows[0].id, request.body.uuid], function(err, result) {
					done();
					if (err){ 
						console.error(err); 
						response.status(500).send("Error " + err);
					} else {
						response.send(result.rows[0]);
					}
				});
			} else {
				client.query('INSERT INTO highscores (uuid, name, score, timestamp) VALUES($1, $2, $3, $4) RETURNING *;', [request.body.uuid, request.body.name, request.body.score, new Date()], function(err, result) {
					done();
					if (err){ 
						console.error(err); 
						response.status(500).send("Error " + err);
					} else {
						response.send(result.rows[0]);
					}
				});
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
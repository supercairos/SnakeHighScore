var pg = require('pg')
var express = require('express')
var cool = require('cool-ascii-faces');

var app = express()

app.get('/highscore', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
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

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
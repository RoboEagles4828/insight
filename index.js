var express = require('express');
var fs      = require('fs');
var http    = require('http');
var moment  = require('moment');
var path    = require('path');
var request = require('request');
var stipes  = require('stipes');
require('pretty-error').start();
stipes.success('init', 'logging library loaded');

var app = express();
var server = app.listen(3000);
var scores = app.listen(3001);
var io = require('socket.io').listen(server);
stipes.success('init', 'bound successfully to port 3000');
var io2 = require('socket.io').listen(scores);
stipes.success('init', 'bound successfully to port 3001');
team = '4828';
stipes.debug('insight', 'running on behalf of team ' + team);

app.set('views', __dirname + '/views');
app.use(express.static('fonts'));

var server = http.createServer(app);

app.get('/css/bootstrap.min.css', function(req, res) {
	res.sendFile(__dirname + '/bower_components/flat-ui/dist/css/vendor/bootstrap.min.css');
});

app.get('/css/flat-ui.min.css', function(req, res) {
	res.sendFile(__dirname + '/bower_components/flat-ui/dist/css/flat-ui.min.css');
});

app.get('/css/custom.css', function(req, res) {
	res.sendFile(__dirname + '/custom/style.css');
});

app.get('/next.html', function(req, res) {
	res.sendFile(__dirname + '/next.html');
});

app.get('/upcoming.html', function(req, res) {
	res.sendFile(__dirname + '/upcoming.html');
});

app.get('/scores.html', function(req, res) {
	res.sendFile(__dirname + '/scores.html');
});

function sortProperties(obj)
{
  // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
      return a[1]-b[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

io.on('connection', function (socket) {
	var datapath = path.join(__dirname, 'data.json');
	var obj = JSON.parse(fs.readFileSync(datapath, 'utf8'));
	upcoming = [];
	for (var i = 0; i < obj.length; i++) {
		var match = obj[i];
		if (match.time * 1000 >= 1) {
			teamColor = '';
			if (match.alliances.red.teams.indexOf('frc' + team) > -1) {
				teamColor = 'red';
			}
			else {
				teamColor = 'blue';
			}
			upcoming.push(
				{ 
					number: match.match_number.toString(),
					time: moment(match.time *1000).format('MM/DD/YYYY hh:mm a').toString(),
					red: [match.alliances.red.teams[0].substring(3), match.alliances.red.teams[1].substring(3), match.alliances.red.teams[2].substring(3)],
					blue: [match.alliances.blue.teams[0].substring(3), match.alliances.blue.teams[1].substring(3), match.alliances.blue.teams[2].substring(3)],
					color: teamColor
				}
			);
		}
	}
	socket.emit('next', upcoming);
});

io2.on('connection', function (socket) {
	var result = {};
	var options = {
	    url: 'https://www.thebluealliance.com/api/v2/event/2015ncre/stats',
	    headers: {'X-TBA-App-ID': 'frc4828:insight:v1.0.0'}
	};

	function callback(error, response, body) {
		try {
	    	result = JSON.parse(body);
		    var oprs = sortProperties(result.oprs).reverse();
		    var dprs = sortProperties(result.dprs).reverse();
		    var ccwms = sortProperties(result.ccwms).reverse();
		    socket.emit("scores",
		    	{
		    		"oprs": oprs,
		    		"dprs": dprs,
		    		"ccwms": ccwms
		    	}
	    	);
		} catch (e) {
			stipes.error('insight', "failed to update score");
		}
	}
	request(options, callback);
});

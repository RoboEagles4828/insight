var express = require('express');
var fs      = require('fs');
var http    = require('http');
var moment  = require('moment');
var path    = require('path');
var request = require('request');
var stipes  = require('stipes');
require('pretty-error').start();
stipes.success('init', 'logging library loaded');

team = 4828;
var app = express();
stipes.debug('insight', 'running on behalf of team ' + team);

app.set('views', __dirname + '/views');
app.use(express.static('fonts'));
app.set('view engine', 'ejs');

var server = http.createServer(app);

app.get('/', function(req, res) {
	var startpoint = -1;
	var i = 0;
	var uptodate = false;
	data = formatMatches();
	while (i < data.length && uptodate == false) {
		if (data[i].timestamp * 1000 >= Date.now()) {
			uptodate = true;
			startpoint = i;
		} else {
			i++;
		}
	}
	res.render(__dirname + '/views/pages/combo.ejs',
		{
			data: formatMatches(),
			startpoint: startpoint,
			uptodate: uptodate,
			event: getEventInfo(),
			version: process.env.npm_package_version,
			node: process.version
		}
	);
});

app.get('/css/bootstrap.min.css', function(req, res) {
	res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});

app.get('/css/custom.css', function(req, res) {
	res.sendFile(__dirname + '/custom/style.css');
});

app.get('/next.html', function(req, res) {
	res.sendFile(__dirname + '/next.html');
});

app.get('/upcoming.html', function(req, res) {
	res.render(__dirname + '/views/pages/upcoming.ejs', {data: formatMatches()});
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

function getEventInfo()
{
	var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
	return {name: data.name, key: data.key};
}

function formatMatches()
{
	var datapath = path.join(__dirname, 'data.json');
	var obj = JSON.parse(fs.readFileSync(datapath, 'utf8')).matches;
	upcoming = [];
	for (var i = 0; i < obj.length; i++) {
		var match = obj[i];
		if (new Date(match.time * 1000).getDate() == new Date(Date.now()).getDate()) {
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
					time: moment(match.time *1000).format('hh:mm a').toString(),
					timestamp: match.time,
					red: [match.alliances.red.teams[0].substring(3), match.alliances.red.teams[1].substring(3), match.alliances.red.teams[2].substring(3)],
					blue: [match.alliances.blue.teams[0].substring(3), match.alliances.blue.teams[1].substring(3), match.alliances.blue.teams[2].substring(3)],
					score_breakdown: match.score_breakdown,
					color: teamColor
				}
			);
		}
	}
	return upcoming;
}

app.listen(3000);

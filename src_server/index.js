RandomTicketGenerator = require("./RandomTicketGenerator.js");

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// environment paramaters check
var env = process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;
var protocol = process.env.PROTOCOL || "http";
var host = process.env.HOST || "localhost";
var port = process.env.PORT || env === PRODUCTION ? 3001 : 3005;
if (env == DEVELOPMENT) {
	outpotDir = '../build_development';
} else {
	outpotDir = '../build_production';
}
console.log('setting app for ' + env + ' environment');

// file system - for log file
var fs = require('fs');
var morgan = require('morgan')
var path = require('path')

// server apps
const express = require('express');
const cors = require('cors');
const app = express();

// the random ticket generator object
var rtg = new RandomTicketGenerator();

// start the server
app.listen(port, () => {
	console.log(`Starting express server on localhost running on port ${port}`);
});

// log requests
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
	flags: 'a'
})

// setup the logger
app.use(morgan('combined', {
	stream: accessLogStream
}))

// initialize static routes
app.use(express.static(outpotDir));

// cros-origin
app.use(cors());

// api
// notify - check if server is live
app.get('/notify/', (req, res) => {
	console.log('notify call');
	res.send('OK');
});
// get outcome
// return a slot game ticket as json
app.get('/getOutcome/', (req, res) => {
	var ticket = rtg.getTicket();
	console.log('outcome ticket: ' + JSON.stringify(ticket));
	res.json(ticket);
});



module.exports = app;
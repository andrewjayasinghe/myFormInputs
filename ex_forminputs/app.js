var express = require('express');
var http    = require('http');
var path    = require('path');
var engine  = require('ejs-locals');
var app     = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Enable routing and use port 1337.
require('./router')(app);
app.set('port', 1337);

// Set up ejs templating.
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Set view folder.
app.set('views', path.join(__dirname, 'views'));
 
// Let's us reference images from a public image folder.
app.use(express.static(__dirname+'/public'));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

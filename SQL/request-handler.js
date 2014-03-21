var path = require('path');
var url = require('url');
var helpers = require('./http-helpers');
var server = require("./persistent_server");
var querystring = require('querystring');

var handleGet = function(request, response){
  var query = 'SELECT * FROM message';
  server.dbConnection.query(query, function(err, rows, fields) {
    if (err) throw err;
    console.log('***', response, {results: rows});
    helpers.sendResponse(response, {results: rows} );
  });
};

var handlePost = function(request, response){
  helpers.collectData(request, function(data){
    var message = querystring.parse(data);
    var roomname = message.hasOwnProperty(roomname) ? message.roomname : '';
    var params = '"' + message.username + '","' + roomname + '","' + message.message + '"';
    var query = 'INSERT INTO message (username, roomname, message) VALUES (' + params + ')';
    server.dbConnection.query(query, function(err, rows, fields) {
      if (err) throw err;
      helpers.sendResponse(response, null, 201);
    });
  });
};

var actions = {
  'GET': handleGet,
  'POST': handlePost
};

exports.handleRequest = function (req, res) {

  var method = actions[req.method];

  if( method ){
    method(req, res);
  } else {
    helpers.sendResponse(res, undefined, 404);
  }
};

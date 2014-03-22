var path = require('path');
var url = require('url');
var helpers = require('./http-helpers');
var server = require("./persistent_server");
var querystring = require('querystring');

var handleGet = function(request, response){
  var params = url.parse(request.url, true).query;
  var query = 'SELECT * FROM message ORDER BY updated_at DESC';
  if (params.hasOwnProperty('where')){
    var args = JSON.parse(params.where);
    query = "SELECT * FROM message WHERE roomname = '" + args.roomname + "'ORDER BY updated_at DESC";
  }
  server.dbConnection.query(query, function(err, rows, fields) {
    if (err) throw err;
    helpers.sendResponse(response, {results: rows} );
  });
};

var handlePost = function(request, response){
  helpers.collectData(request, function(data){
    // var message = querystring.parse(data);
    var message = JSON.parse(data);
    console.log(message);
    var roomname = message.hasOwnProperty('roomname') ? message.roomname : '';
    var params = '"' + message.username + '","' + roomname + '","' + message.text + '"';
    var query = 'INSERT INTO message (username, roomname, text) VALUES (' + params + ')';
    server.dbConnection.query(query, function(err, rows, fields) {
      if (err) throw err;
      helpers.sendResponse(response, null, 201);
    });
  });
};

var handleOptions = function(request, response){
  helpers.sendResponse(response, null);
};

var actions = {
  'GET': handleGet,
  'POST': handlePost,
  'OPTIONS': handleOptions
};

exports.handleRequest = function (req, res) {

  var method = actions[req.method];

  if( method ){
    method(req, res);
  } else {
    helpers.sendResponse(res, undefined, 404);
  }
};

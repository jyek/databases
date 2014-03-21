var path = require('path');
var url = require('url');
var helpers = require('./http-helpers');
var server = require("./persistent_server");
var querystring = require('querystring');

var handleGet = function(){

};

var handlePost = function(request, response){
  // listen for chunks, assemble them
  helpers.collectData(request, function(data){
    // parse the data
    console.log('data', data);
    var message = querystring.parse(data);
    console.log(message);
    var roomname = message.hasOwnProperty(roomname) ? message.roomname : '';
    var params = '"' + message.username + '","' + roomname + '","' + message.message + '"';
    var query = 'INSERT INTO message (username, roomname, message) VALUES (' + params + ')';
    console.log(query);
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

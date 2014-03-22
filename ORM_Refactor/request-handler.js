var path = require('path');
var url = require('url');
var helpers = require('./http-helpers');
var server = require("./persistent_server");
var querystring = require('querystring');

var handleGet = function(request, response){
  var params = url.parse(request.url, true).query;
  // var query = 'SELECT * FROM message ORDER BY updated_at DESC';
  var opts = {};
  if (params.hasOwnProperty('where')){
    var args = JSON.parse(params.where);
    opts.roomname = args.roomname;
  }

  server.dbConnection.getMessages(opts, function(messages){
    helpers.sendResponse(response, {results: messages} );
  });
};

var handlePost = function(request, response){
  helpers.collectData(request, function(data){
    var message = JSON.parse(data);
    var roomname = message.hasOwnProperty('roomname') ? message.roomname : '';

    server.dbConnection.addMessage(message.text, message.username, roomname, function(){
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

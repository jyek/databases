var path = require('path');
var url = require('url');
var helpers = require('./http-helpers');
var server = require("./persistent_server");
var querystring = require('querystring');

var handleGet = function(request, response){
  var params = url.parse(request.url, true).query;
  // var query = 'SELECT * FROM message ORDER BY updated_at DESC';
  var query = 'SELECT message.text, user.username, room.roomname \
               FROM message \
               LEFT JOIN user ON message.user_id = user.user_id \
               LEFT JOIN room ON message.room_id = room.room_id \
               ORDER BY updated_at DESC';
  if (params.hasOwnProperty('where')){
    var args = JSON.parse(params.where);
    query = "SELECT message.text, user.username, room.roomname \
             FROM message \
             LEFT JOIN user ON message.user_id = user.user_id \
             LEFT JOIN room ON message.room_id = room.room_id \
             WHERE room.roomname = '" + args.roomname + "'\
             ORDER BY updated_at DESC";
  }
  server.dbConnection.query(query, function(err, rows, fields) {
    if (err) throw err;
    helpers.sendResponse(response, {results: rows} );
  });
};

var handlePost = function(request, response){
  helpers.collectData(request, function(data){
    var message = JSON.parse(data);
    var roomname = message.hasOwnProperty('roomname') ? message.roomname : '';

    var roomQuery = "INSERT INTO room (room.roomname) \
                     SELECT * FROM (SELECT '" + roomname + "') AS tmp \
                     WHERE NOT EXISTS (SELECT * FROM room WHERE room.roomname = '" + roomname + "') \
                     LIMIT 1"
    var userQuery = "INSERT INTO user (user.username) \
                     SELECT * FROM (SELECT '" + message.username + "') AS tmp \
                     WHERE NOT EXISTS (SELECT * FROM user WHERE user.username = '" + message.username + "') \
                     LIMIT 1"
    var msgQuery = "INSERT INTO message (text, user_id, room_id) \
                    VALUES ('" + message.text + "', \
                    (SELECT user_id FROM user WHERE user.username = '" + message.username + "'), \
                    (SELECT room_id FROM room WHERE room.roomname = '" + roomname + "'))";

    server.dbConnection.query(roomQuery, function(err, rows, fields) {
      server.dbConnection.query(userQuery, function(err, rows, fields) {
        server.dbConnection.query(msgQuery, function(err, rows, fields) {
          if (err) throw err;
          helpers.sendResponse(response, null, 201);
        });
      });
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

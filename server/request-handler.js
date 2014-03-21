var httpHelpers = require('./http-helpers');

var objectId = 1;
var messages = [
  {
    objectId: objectId,
    username: 'fred',
    text: 'hello world'
  }
];

var getMessages = function(request, response){
  httpHelpers.sendResponse(response, {results: messages} );
};

var postMessage = function(request, response){
  // listen for chunks, assemble them
  httpHelpers.collectData(request, function(data){
    // parse the data
    var message = JSON.parse(data);
    objectId++;
    message.objectId = objectId;
    // push into messages
    messages.unshift(message);
    httpHelpers.sendResponse(response, null, 201);
  })
};

var options = function(request, response){
  httpHelpers.sendResponse(response);
};

var actions = {
  'GET': getMessages,
  'POST': postMessage,
  'OPTIONS': options
};

exports.handler = function(request, response) {
  var action = actions[request.method];
  if( action ){
    action(request, response);
  } else {
    httpHelpers.sendResponse(response, null, 404);
  }
};
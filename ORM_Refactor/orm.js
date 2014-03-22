/*
 * Initialize sequelize
 */
var Sequelize = require("sequelize");

var sequelize = new Sequelize("chatSequelize", "root", "", {dialect: "mysql", port: 3306});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  });

/*
 * Create database
 */
var User = sequelize.define('User', {
  username: Sequelize.STRING,
});

var Room = sequelize.define('Room', {
  roomname: Sequelize.STRING,
});

var Message = sequelize.define('Message', {
  text: Sequelize.STRING
});

User.hasMany(Message);
Message.belongsTo(User);

Room.hasMany(Message);
Message.belongsTo(Room);

/*
 * Sync
 * sync() makes Sequelize create the database table for us if it doesn't
 * exist already
 */
User.sync().success(function() {
  var user = User.build({username: "Cho"});
  user.save();
});

/*
 * Methods
 */
exports.getMessages = function(opts, callback){
  callback = callback || function(){};
  var params = { include: [Room, User] , order: [{raw: 'updatedAt DESC'}]};
  if (opts.roomname !== undefined) params.where = ['roomname=?', opts.roomname];
  Message.findAll(params).success(function(messages){
    var results = [];
    for (var i = 0; i < messages.length; i++){
      var msg = messages[i];
      var username = msg.dataValues.user ? msg.dataValues.user.dataValues.username : '';
      var roomname = msg.dataValues.room ? msg.dataValues.room.dataValues.roomname : '';
      results.push( {text: msg.dataValues.text, username: username, roomname: roomname} );
      console.log(msg.dataValues);
      // console.log(msg.text, msg.UserId, msg.roomId);
    }
    callback(results);
  });
};

exports.addMessage = function (text, username, roomname, callback){
  callback = callback || function(){};
  User.findOrCreate({username: username}).success(function(user) {
    Room.findOrCreate({roomname: roomname}).success(function(room) {
      var msg = {text: text, UserId: user.id, RoomId: room.id};
      Message.create(msg).success(function(message) {
        console.log('Message added:', message.dataValues);
        callback(true);
      });
    });
  });
};

// Message.create({text: "this is my text, HR"}).complete(function(err, message) {
//   User.create({username: "Warren Ng"}).complete(function(err, user) {
//     message.setUser(user).complete(function(err) {
//       message.getUser().complete(function(err, _user) {
//       });
//     });
//   });

//   Room.create({roomname: "JustinHQ"}).complete(function(err, room) {
//     message.setRoom(room).complete(function(err) {
//       message.getRoom().complete(function(err, _message) {
//       });
//     });
//   });
// });
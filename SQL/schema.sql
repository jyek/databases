CREATE DATABASE chat;

USE chat;

CREATE TABLE room (
  `room_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NULL,
   PRIMARY KEY  (`room_id`)
);

CREATE TABLE user (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NULL,
   PRIMARY KEY  (`user_id`)
);

CREATE TABLE message (
  `message_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(500) NULL,
  `user_id` int(10) unsigned NULL,
  `room_id` int(10) unsigned NULL,
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL default now() ON UPDATE now(),
  PRIMARY KEY  (`message_id`),
  FOREIGN KEY (`user_id`) REFERENCES user(`user_id`),
  FOREIGN KEY (`room_id`) REFERENCES room(`room_id`)
);
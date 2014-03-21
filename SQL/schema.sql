CREATE DATABASE chat;

USE chat;

CREATE TABLE message (
  `message_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NULL,
  `roomname` varchar(50) NULL,
  `text` varchar(500) NULL,
  `created_at` timestamp NOT NULL default '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL default '0000-00-00 00:00:00',
   PRIMARY KEY  (`message_id`)
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/

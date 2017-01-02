import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import '../startup/mail-url.js';

export const News = new Mongo.Collection('news');
export const Comments = new Mongo.Collection('comments');



if (Meteor.isServer) {
  Meteor.publish('news', function newsPublication() {
        return News.find({
    });
  });

  Meteor.publish('comments', function commentsPublication() {
        return Comments.find({
    });
  });

  Meteor.publish('userList', function (){
    return Meteor.users.find({});
  });
}

Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },

  sendVerificationLink() {
//
  },

  'admin.insert'(email, username, password) {
    check([email, username, password], [String]);

    Accounts.createUser({
      email: email,
      password: password,
      profile: {
        name: username,
        flag: 'admin',
      }
    });
  },

  'user.insert'(email, username, password) {
    check([email, username, password], [String]);

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(email)) {
        Accounts.createUser({
          email: email,
          password: password,
          profile: {
            name: username,
            flag: 'user',
          }
        });
      } else {
        console.log('wrong email');
      }
  },

  'user.login'(email, password) {
    check([email, password], [String]);

    Meteor.loginWithPassword(email, password);
  },

  'user.remove'(id) {
    Meteor.users.remove({
     _id: id
    })
  },

  'user.allremove'(id) {
    Meteor.users.remove({})
  },

  'news.insert'(header, text) {
    check([header, text], [String]);

    News.insert({
      header,
      text,
      owner: Meteor.users.findOne(this.userId).username || Meteor.users.findOne(this.userId).profile.name,
      createdAt: new Date(),
    });
  },

  'news.remove'(newsId) {
    check(newsId, String);

    News.remove(newsId);
    Comments.remove({newsId: newsId});
  },

  'news.removeEntire'() {
    News.remove({});
  },

  'news.update'(newsId, newtext) {
    check(newsId, String);
    check(newtext, String);

    News.update(newsId, { $set: { text: newtext } });
  },

  'comments.insert'(newsId, text) {
    check([newsId, text], [String]);

    Comments.insert({
      newsId,
      text,
      owner: Meteor.users.findOne(this.userId).username || Meteor.users.findOne(this.userId).profile.name,
      ownerId: Meteor.users.findOne(this.userId)._id || Meteor.users.findOne(this.userId)._id,
      createdAt: new Date(),
    });
  },

  'comment.remove'(commentId) {
    check(commentId, String);

    Comments.remove(commentId);
  },

  'comments.removeEntire'() {
    Comments.remove({});
  },
});
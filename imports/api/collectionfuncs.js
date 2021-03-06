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
      text: text,
    });
  },

  sendVerificationLink() {
    const user = Meteor.users.find({}).fetch().length - 1;

    Accounts.sendVerificationEmail(Meteor.users.find({}).fetch()[user]._id);
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

  'user.updateFlag'(userId, userFlag) {
    check([userId, userFlag], [String]);

    Meteor.users.update(userId, { $set: { 'profile.flag': userFlag }});
  },

  'user.updateName'(userId, userFlag, username) {
    check([userId, userFlag, username], [String]);

    if( username !== Meteor.user().profile.name ) {
      Meteor.users.update(userId, {
        $set: { profile: {
          flag: userFlag,
          name: username }
        }
      });
    } else {
      console.log('error');
    }
  },

  'user.updateEmail'(userId, verified, oldEmail, email) {
    check([userId, oldEmail, email], [String]);
    check(verified, Boolean);

    if( email !== Meteor.user().emails[0].email ) {
      Meteor.users.update({ _id: Meteor.userId(), 'emails.0.address': oldEmail },
      { $set: { 'emails.0.address': email }});
    } else {
      console.log('error');
    }
  },

  'user.checkPassword'(digest) {
    check(digest, String);

    if (this.userId) {
      const user = Meteor.user();
      const password = {digest: digest, algorithm: 'sha-256'};
      const result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  },

  'user.changePassword'(userId, newPassword) {
    check([userId, newPassword], [String]);

    Accounts.setPassword(userId, newPassword)
  },

  'user.addMessage'(userId, text, newsId) {
    check([userId, text, newsId], [String]);

    if(text.length) {
      Meteor.users.update(userId, {
        $push: {
          message: {
            content: text,
            newsId: newsId,
          }
        }
      });
    }
  },

  'user.removeMessage'(userId, content, newsId) {
    check([userId, content, newsId], [String]);

    Meteor.users.update(userId, {
      $pull: {
        message: {
          content: content,
          newsId: newsId,
        }
      }
    });
  },

  'user.login'(email, password) {
    check([email, password], [String]);

    Meteor.loginWithPassword(email, password);
  },

  'user.remove'(id) {
    check(id, String);

    Meteor.users.remove({
     _id: id
    })
  },

  'user.allremove'(id) {
    Meteor.users.remove({})
  },

  'news.insert'(header, intro, text) {
    check([header, intro, text], [String]);

    if( header && text ) {
      News.insert({
        header,
        intro,
        text,
        ownerID: Meteor.userId(),
        createdAt: new Date(),
      });
    }
  },

  'news.remove'(newsId) {
    check(newsId, String);

    News.remove(newsId);
    Comments.remove({newsId: newsId});
  },

  'news.removeEntire'() {
    News.remove({});
  },

  'news.updateWithIntro'(newsId, newHeader, newIntro, newtext) {
    check([newsId, newHeader, newIntro, newtext], [String]);

    News.update(newsId, { $set: {
      header: newHeader,
      intro: newIntro,
      text: newtext }
    });
  },

  'news.updateWithoutIntro'(newsId, newHeader, newtext) {
    check([newsId, newHeader, newtext], [String]);

    News.update(newsId, { $set: {
      header: newHeader,
      text: newtext }
    });
  },

  'comments.insert'(newsId, text) {
    check([newsId, text], [String]);

    if( text.length <= 500) {
      let input = text;
      input = input.replace(/</g, '&lt;');
      input = input.replace(/>/g, '&gt;');

      input = input.replace(/\[b]/g, '<b>');
      input = input.replace(/\[\/b]/g, '</b>');

      input = input.replace(/\[i]/g, '<i>');
      input = input.replace(/\[\/i]/g, '</i>');

      input = input.replace(/\r?\n/g, '<br>');

      Comments.insert({
        newsId,
        text: input,
        owner: Meteor.users.findOne(this.userId).username || Meteor.users.findOne(this.userId).profile.name,
        ownerId: Meteor.users.findOne(this.userId)._id || Meteor.users.findOne(this.userId)._id,
        createdAt: new Date(),
      });
    }
  },

  'comment.remove'(commentId) {
    check(commentId, String);

    Comments.remove(commentId);
  },

  'comment.update'(commentId, newtext) {
    check(commentId, String);
    check(newtext, String);

    if( newtext.length <= 500) {
      let input = newtext;
      input = input.replace(/</g, '&lt;');
      input = input.replace(/>/g, '&gt;');

      input = input.replace(/\[b]/g, '<b>');
      input = input.replace(/\[\/b]/g, '</b>');

      input = input.replace(/\[i]/g, '<i>');
      input = input.replace(/\[\/i]/g, '</i>');

      input = input.replace(/\r?\n/g, '<br>');

      Comments.update(commentId, { $set: { text: input } });
    }
  },

  'comments.removeEntire'() {
    Comments.remove({});
  },
});
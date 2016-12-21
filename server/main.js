import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';
//import { Email } from 'meteor/email'

import '../imports/api/collectionfuncs.js';
import '../imports/startup/mail-url.js';

Meteor.startup(() => {
  // code to run on server at startup

  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        clientId: '935764899987-amv66u0ec1u5skgfibn38u8paplo59a9.apps.googleusercontent.com',
        loginStyle: 'popup',
        secret: 'MXvSwWnW47Ye3VddCXNBreUn',
      },
    }
  );
});
import { Mongo } from 'meteor/mongo';

export const News = new Mongo.Collection('news');
export const Comments = new Mongo.Collection('comments');
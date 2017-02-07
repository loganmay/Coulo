import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('cards', function cardsPublication() {
    return Cards.find();
  });
}

Meteor.methods({
  'cards.create'(businessName, totalPunches) {
    check(businessName, String);
    check(totalPunches, Number);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Cards.insert({
      businessName,
      totalPunches,
      punched: 0,
      createdAt: new Date(),
      owner: this.userId,           // _id of logged in user
      username: Meteor.users.findOne(this.userId).username,  // username of logged in user
    });
  },

  'cards.remove'(cardId) {
    check(cardId, String);
    Cards.remove(cardId);
  },

  'cards.punch'(cardId, total, punched) {
    check(cardId, String);
    if (total > punched) {
      Cards.update(cardId, { $inc: { punched: 1 }, });
    }
  },
});

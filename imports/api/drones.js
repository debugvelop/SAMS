import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const Drones = new Mongo.Collection('drones');
export default Drones;

/*Meteor.methods({
    'drones.update': Meteor.bindEnvironment(function(droneIndex, salinity){

  });
});*/

Meteor.methods({

  'drones.update' (droneIndex, salinity) {
    console.log('Database modification is called!');
    console.log('index: ' + droneIndex);
    console.log('sal: ' + salinity);
    Drones.update({index: parseInt(droneIndex)}, {
      $addToSet: {salinity:
        {
          value: parseInt(salinity),
          time: new Date().toISOString()
        }}
    });
  },
});

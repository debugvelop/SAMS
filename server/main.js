/* SERVER */
import { Meteor } from 'meteor/meteor';
import Drones from '../imports/api/drones';

var Fiber = require('fibers');
// CONNECT TO CLOUD MQTT
var mqtt = require('mqtt');
var mqttClient = mqtt.connect('mqtt://thuan:Alucard2000@m11.cloudmqtt.com:11192');

console.log('MQTT Client?');
/* When connected to mqtt */

mqttClient.on('connect', function(){
  console.log('MQTT connected!');

  mqttClient.subscribe('salinity');

  mqttClient.on('message', function(topic,message,packet){
    if (topic == 'salinity'){
      /* Save this info into the database */
      console.log('Received salinity topic message: ');
      console.log('Message: ' + message);

      var obj = JSON.parse(message)

      var droneIndex = obj.S1;
      var salinity = obj.S2;

      console.log('droneIndex: ' + droneIndex);
      console.log('salinity: ' + salinity);

      /* Update the drone's salinity level */
      Fiber(function(){
        Meteor.call('drones.update', droneIndex, salinity);
      }).run();

      /* Re-fire the time message */
      var temp = new Date();
      var timeObj = {
        S1: temp.getHours().toString(),
        S2: temp.getMinutes().toString(),
      };
      console.log(JSON.stringify(timeObj));
      console.log('REFIRE TIME!');
      mqttClient.publish('time', JSON.stringify(timeObj));
    }
  });
});

/* METEOR */
Meteor.startup(() => {


});

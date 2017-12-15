# SAMS  
======

SALINITY MONITORING SYSTEM VERSION 1.0.2
------

In Vietnam, there is a growing problem of increasingly unstable salinity intrusion levels. Therefore, it is imperative that there exists a reliable real-time monitoring system for salinity levels.


There are 5 drones currently out in the field and collecting data. However, they are misplaced. You must help fix this problem by relocating these drones to these designated coordinates:


| Drones        | Latitude           | Longitude  |
| ------------- |:-------------:| -----:|
| Drone 1    | 10.009792 | 105.755685 |
| Drone 2    | 10.007089 | 105.747379 |
| Drone 3    | 10.053446 | 105.789042 |
| Drone 4    | 10.036721 | 105.791165 |
| Drone 5    | 9.994313 | 105.715709 |


In order to do this, you must:


1. Clone this repo
2. Install Meteor [Click on link here](https://www.meteor.com)
3. In the root folder, run `meteor npm install --save`
4. Run `meteor run`
5. Run `meteor mongo`
6. ---- [CONTINUE TO RUN YOUR COMMANDS] -----
7. Submit a screenshot of your completed work and submit for task review.


======
## MORE INFORMATION

This project is developed with Javascript using the Meteor framework. As dictated by Meteor, MongoDB syntax is used for the database.


For completion of this task, here are some crucial information you must know:

1. The database name is `drones`
2. The data structure (or mongo document structure) of each drone is as follows:  

```
{
  "_id" : <Drone's unique id in database>,
  "index" : <Drone's index, eg. 1, 2, 3 , etc>,
  "salinity" : [ { "value" : <current value>, "time" : <current time>)],
  "lat" : <latitude>,
  "lng" : <longitude>
}
```

You can learn more about MongoDB's syntax [here](https://docs.mongodb.com/manual/tutorial/query-documents/)

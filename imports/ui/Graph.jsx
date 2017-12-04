import React, {Component} from 'react';
import Drones from '../api/drones';
var FusionCharts = require("fusioncharts");
require("fusioncharts/fusioncharts.charts")(FusionCharts);

export default class Graph extends Component{

  constructor() {
    super();
  }
  componentWillMount(){
  }
  componentDidMount(){
    /* Needs a time delay for database to load */
    setTimeout(function(){
      var theArray = Drones.
      find({index: parseInt(getParameterByName('droneIndex'))}).
      fetch()[0].salinity;

      /* Determine how many entries we have (maxed up 288)*/
      var maxEntriesMinus = 72;
      for (let i = 72; i > 0; i=i-1){
        if (theArray[theArray.length - i] == null){
          maxEntriesMinus -= 1;
          continue;
        }else{
          //maxEntriesMinus += i;
        }
      }
      console.log('Max Entries is: ' + maxEntriesMinus);

      /* Construct an array of object */
      var dataArray = []; var counter = 0;
      for (let index = theArray.length - (maxEntriesMinus); index < theArray.length; ++index){

        var myDate = new Date(theArray[index].time);
        var minutes = '';
        if (parseInt(myDate.getMinutes()) <= 9){
          minutes = '0' + myDate.getMinutes().toString();
        }else{
          minutes = myDate.getMinutes().toString();
        }
        var result = myDate.getHours().toString() + ':'
        + minutes;
        var tempObj = {
          value: theArray[index].value,
          label: result,
        };
        dataArray[counter] = tempObj;
        counter++;
      };

      var chart = new FusionCharts ({
    	   "type": "line",
    	   "width": "80%",
    	   "height": "80%",
    	   "dataFormat": "json",
    	   "dataSource": {
    		    chart:{
             "xAxisName": "Time",
             "yAxisName": "Salinity (ppt)",
           },
    		    data: dataArray
    	 	}
    	}).render("chartContainer");
    }, 500);
  }
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.headerText}>
          DRONE NO. {getParameterByName('droneIndex')}
        </div>
        <div id="chartContainer" style={styles.chartContainer}></div>
        <div style={styles.footer}>
          <div style={styles.copyright}>
            &copy; 2017 - Thuan H. Nguyen (This site is still under development, contents are subject to change).
          </div>
        </div>
      </div>
    );
  }
}
const styles = {
  container:{
    //padding: '2%',
    display: 'block',
    height: '100%',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    fontFamily: 'Helvetica',
    justifyContent: 'center',
    paddingTop: '2%',
  },
  headerText:{
    display: 'flex',
    flex: 2,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  chartContainer:{
    display: 'flex',
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '100%',
  },
  footer:{
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
  },
  copyright:{
    display:'flex',
    height: 50,
    width: '100%',
    fontSize: 15,
    backgroundColor: 'black',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
};


/* Function to get the query params */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

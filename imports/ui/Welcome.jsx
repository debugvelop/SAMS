import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import GoogleMap from '../lib/GoogleMap';
import Drones from '../api/drones';

/* SELECTABLE LIST COMPONENT */
let SelectableList = makeSelectable(List);
function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };
    constructor(props){
      super(props);
      console.log('Constructor is called!');
      console.dir(props);
    }
    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }
    handleRequestChange = (event, value) => {
      /* Get the array of child nodes of salinityMap */
      var childArray = window.document.getElementById('salinityMap').childNodes;

      /* Dehighlight all listItem elements */
      for (let index = 1; index < childArray.length; ++index){
        childArray[index].
        childNodes[0].
        setAttribute("style",_normalStyle);
      };

      this.setState({
        selectedIndex: value,
      });
      /* Set the drone's index as well */
      if (currentSelectedDroneIndex == value){
        return;
      }else{

        if (currentWindow == null){
          currentWindow = infWindows[value];
          currentWindow.open(_mapInstance,_markers[value]);
          currentSelectedDroneIndex = parseInt(value);
          return;
        }
        /* Close the current infowindow */
        currentWindow.close();
        /* Open the new infowindow */
        currentWindow = infWindows[value];
        currentWindow.open(_mapInstance,_markers[value]);
        /* Set the new drone Index */
        currentSelectedDroneIndex = parseInt(value);
      }
    };

    render() {
      return (
        <ComposedComponent id="salinityMap"
          value={this.state.selectedIndex}
          style={styles.main.list}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}
SelectableList = wrapState(SelectableList);


export default class Welcome extends Component{

  constructor() {
    super();
    // Bind this method to 'this' of Component instance
    this.handleOnMapReady = this.handleOnMapReady.bind(this);
  }
  handleOnMapReady(name) {
    currentSelectedDroneIndex = 5;
    GoogleMaps.ready(name, map => {
      Tracker.autorun(c => {


        _mapInstance = map.instance;

        Drones.find({}).observe({
          added: function(document) {
            const marker = new google.maps.Marker({
              draggable: false,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(document.lat, document.lng),
              map: map.instance,
              index: document.index,
            });

            var contentString = `<div id="content">
              <div id="siteNotice">
              </div>
              <h1>Drone `+ document.index + `</h1>
              <div>
              <b>Salinity: </b> `+ document.salinity[document.salinity.length - 1].value + ` (ppt)
              </div>
              <button id="seeGraph" onClick="seeGraph()">
                VIEW GRAPH
              </button>

              </div>
              `;
            /* How to convert ISODate format to time format */
            //document.salinity[document.salinity.length - 1].time.toTimeString();


            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            infWindows[document.index] = infowindow;

            /* Add listener to marker */
            marker.addListener('click', function(){
              // If it's the first time, assign it.
              if (currentWindow == null){
                currentWindow = infowindow;
              }else{
              // If it's 2nd time and more, close it, assign new.
                currentWindow.close();
                currentWindow = infowindow;
              }
              infowindow.open(map.instance, marker);

              /* Set the new index of the drone */
              currentSelectedDroneIndex = parseInt(document.index);

              /* Get the array of child nodes of salinityMap */
              var childArray = window.document.getElementById('salinityMap').childNodes;

              /* Dehighlight all listItem elements */
              for (let index = 1; index < childArray.length; ++index){
                childArray[index].
                childNodes[0].
                setAttribute("style",_normalStyle);
              };

              /* Highlight the selected listItem of the droneList by changing the styling*/
              childArray[currentSelectedDroneIndex].
              childNodes[0].
              setAttribute("style",_highlightedStyle);
            });

            _markers[document.index] = marker;
          },
          changed: function(newDocument, oldDocument) {
            _markers[newDocument.index].setPosition({
              lat: newDocument.lat,
              lng: newDocument.lng,
            });
          },
          removed: function(oldDocument) {
            _markers[oldDocument.index].setMap(null);
            google.maps.event.clearInstanceListeners(_markers[oldDocument.index]);
            delete _markers[oldDocument.index];
          },
        });
        this.computation = c;
      });
    });
  }
  handleMapOptions() {
    return {
      center: new google.maps.LatLng(10.0451618, 105.74685350000004),
      zoom: 12,
    };
  }


  render() {return (
      <div style={styles.container}>
        <Paper style={styles.header} zDepth={3}>
          <div style={styles.header.headerText}>
            Salinity Monitor Dashboard
          </div>
        </Paper>
        <div style={styles.main}>
          <SelectableList
          value={0}
          defaultValue={0}>
            <Subheader style={{fontFamily: 'Arial'}}>List of drones</Subheader>
            <ListItem
              value={1}
              primaryText="Drone 1"
            />
            <ListItem
              value={2}
              primaryText="Drone 2"
            />
            <ListItem
              value={3}
              primaryText="Drone 3"
            />
            <ListItem
              value={4}
              primaryText="Drone 4"
            />
            <ListItem
              value={5}
              primaryText="Drone 5"
            />
          </SelectableList>
          <Card style={styles.main.mapDisplay}>
            <CardHeader
              title="Locations of drones"
              subtitle="Click on drone to view"
            />
            <CardText>
              Select the drone you wish to view on the map or choose from the list.<br/>
            </CardText>
            <GoogleMap
            style={styles.theMap}
            onReady={this.handleOnMapReady}
            mapOptions={this.handleMapOptions}>
              Loading!
            </GoogleMap>
            <CardActions>
              <FlatButton
              onClick={() => {
                console.log('The current drone index is: ' + currentSelectedDroneIndex);
                window.location.assign("/graph?droneIndex=" + currentSelectedDroneIndex);
              }}
              style={{backgroundColor: '#ffb042', height: '70px'}}
              label="Click to see full salinity graph" />
            </CardActions>
            <div style={styles.footer}>
              <div style={styles.copyright}>
                &copy; 2017 - Thuan H. Nguyen (This site is still under development, contents are subject to change).
              </div>
            </div>
          </Card>
        </div>

      </div>
    );
  }
}

const styles = {
  container:{
    display: 'flex',
    height: '100%',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  header:{
    padding: '1%',
    display: 'flex',
    flex: 0.5,
    flexDirection: 'row',
    backgroundColor: '#253247',
    color: 'white',
    headerText:{
      fontSize: 25,
      flex: 2,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
    },
  },
  main:{
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 8,
    list:{
      flex: 1,
    },
    mapDisplay:{
      flex: 5,
    }
  },
  theMap:{
    display: 'flex',
    flex: 1,
    //width: '300px',
    //height: '300px',
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

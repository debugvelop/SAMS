/* CLIENT */
import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Router, Route } from 'react-router';
import browserHistory from '../imports/api/history.js';

/* Components to render */
import Welcome from '../imports/ui/Welcome.jsx';
import Graph from '../imports/ui/Graph.jsx';

/* Welcome Page - MuiTheme wrapped */
const WelcomeContainer = () => (
  <MuiThemeProvider>
    <Welcome/>
  </MuiThemeProvider>
);



export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div>
      <Route exact path="/" component={WelcomeContainer}/>
      <Route path="/graph" component={Graph}/>
    </div>
  </Router>
);

Meteor.startup(() => {
  render(renderRoutes() , document.getElementById('render-target'));
});

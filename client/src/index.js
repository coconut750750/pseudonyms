import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import App from './App';
import HowTo from './routes/HowTo';
import MoreGames from './routes/MoreGames';
import Walkthrough from './routes/Walkthrough';
import SubmitFeedback from './routes/Feedback';
import Footer from './components/Footer';

ReactDOM.render(<Index />, document.getElementById('root'));

function StaticHeader(props) {
  return (
    <div id="header">
      <h3>Pseudonyms</h3>
      <h6>Codenames online</h6>
      <hr/>
    </div>
  );
}

function Index(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/howto"><StaticHeader/><HowTo/></Route>
        <Route exact path="/moregames"><StaticHeader/><MoreGames/></Route>
        <Route exact path="/walkthrough"><StaticHeader/><Walkthrough/></Route>
        <Route exact path="/feedback"><StaticHeader/><SubmitFeedback/></Route>
        <Route exact path="/:gamecode" component={App}></Route>
        <Route exact path="/" component={App}></Route>
      </Switch>
      <Footer/>
    </Router>
  );
}

serviceWorker.unregister();

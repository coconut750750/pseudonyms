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
import Footer from './components/Footer';

ReactDOM.render(<Index />, document.getElementById('root'));

function StaticHeader(props) {
  return (
    <div>
      <br/>
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
        <Route path="/howto"><StaticHeader/><HowTo/></Route>
        <Route path="/more"><StaticHeader/><MoreGames/></Route>
        <Route path="/walkthrough"><StaticHeader/><Walkthrough/></Route>
        <Route path="/"><App/></Route>
      </Switch>
      <Footer/>
    </Router>
  );
}

serviceWorker.unregister();

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
import Header from './components/Header';
import Footer from './components/Footer';

ReactDOM.render(<Index />, document.getElementById('root'));

function Index(props) {
  return (
    <Router>
      <div className="non-footer">
        <Header/>

        <div className="outer">
          <Switch>
            <Route exact path="/howto"><HowTo/></Route>
            <Route exact path="/moregames"><MoreGames/></Route>
            <Route exact path="/walkthrough"><Walkthrough/></Route>
            <Route exact path="/feedback"><SubmitFeedback/></Route>
            <Route exact path="/:urlgamecode" component={App}></Route>
            <Route path="/" component={App}></Route>
          </Switch>
        </div>
      </div>

      <Footer/>
    </Router>
  );
}

serviceWorker.unregister();

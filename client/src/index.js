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
// import Walkthrough from './routes/Walkthrough';
import SubmitFeedback from './routes/Feedback';
import Header from './components/Header';
import Footer from './components/Footer';

import { ClassicResult, DuetResult } from './storybook';

ReactDOM.render(<Index />, document.getElementById('root'));

function Index(props) {
  return (
    <Router>
      <Header/>

      <div className="outer">
        <Switch>
          {process.env.NODE_ENV === 'development' &&
            <div>
              <Route exact path="/story/classic"><ClassicResult /></Route>
              <Route exact path="/story/duet"><DuetResult /></Route>
            </div>
          }
          <Route exact path="/howto"><HowTo/></Route>
          <Route exact path="/moregames"><MoreGames/></Route>
          <Route exact path="/feedback"><SubmitFeedback/></Route>
          <Route exact path="/:urlgamecode" component={App}></Route>
          <Route path="/" component={App}></Route>
        </Switch>
      </div>

      <Footer/>
    </Router>
  );
}

serviceWorker.unregister();

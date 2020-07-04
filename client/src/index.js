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

import Login from './auth/Login';
import Register from './auth/Register';
import Forgot from './auth/Forgot';
import ForgotReturn from './auth/ForgotReturn';
import Profile from './auth/Profile';

ReactDOM.render(<Index />, document.getElementById('root'));

function Index(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/howto"><Header/><HowTo/></Route>
        <Route exact path="/moregames"><Header/><MoreGames/></Route>
        <Route exact path="/walkthrough"><Header/><Walkthrough/></Route>
        <Route exact path="/feedback"><Header/><SubmitFeedback/></Route>
        <Route exact path="/login"><Header/><Login/></Route>
        <Route exact path="/register"><Header/><Register/></Route>
        <Route exact path="/forgot"><Header/><Forgot/></Route>
        <Route exact path="/forgot/:rtoken" component={(props) => [<Header/>, <ForgotReturn {...props}/>]}></Route>
        <Route exact path="/profile"><Header/><Profile/></Route>
        <Route exact path="/:gamecode" component={App}></Route>
        <Route exact path="/" component={App}></Route>
      </Switch>

      <Footer/>
    </Router>
  );
}

serviceWorker.unregister();

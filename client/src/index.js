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

import { ProvideAuth } from "./auth/useAuth.js";
import Login from './auth/Login';
import Register from './auth/Register';
import Forgot from './auth/Forgot';
import ForgotReturn from './auth/ForgotReturn';
import Profile from './auth/Profile';

ReactDOM.render(<Index />, document.getElementById('root'));

function HeaderedComponent(Component) {
  return (props) => {
    return (
      <div>
        <Header/>
        <Component {...props}/>
      </div>
    )
  }
}

function Index(props) {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route exact path="/howto"><Header/><HowTo/></Route>
          <Route exact path="/moregames"><Header/><MoreGames/></Route>
          <Route exact path="/walkthrough"><Header/><Walkthrough/></Route>
          <Route exact path="/feedback"><Header/><SubmitFeedback/></Route>
          <Route exact path="/login" component={HeaderedComponent(Login)}></Route>
          <Route exact path="/register" component={HeaderedComponent(Register)}></Route>
          <Route exact path="/forgot"><Header/><Forgot/></Route>
          <Route exact path="/forgot/:rtoken" component={HeaderedComponent(ForgotReturn)}></Route>
          <Route exact path="/profile"><Header/><Profile/></Route>
          <Route exact path="/:urlgamecode" component={App}></Route>
          <Route path="/" component={App}></Route>
        </Switch>

        <Footer/>
      </Router>
    </ProvideAuth>
  );
}

serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import App from './App';
import HowTo from './routes/HowTo';
import MoreGames from './routes/MoreGames';
import SubmitFeedback from './routes/Feedback';
import Header from './components/Header';
import Footer from './components/Footer';

import { PreferencesContextProvider } from './contexts/PreferencesContext';

import { ClassicResult, DuetResult } from './storybook';

ReactDOM.render(<Index />, document.getElementById('root'));

function Index(props) {
  return (
    <Router>
      <PreferencesContextProvider>
        <Header/>

        <div className="outer">
          <Switch>
            {import.meta.env.DEV &&
              <Route exact path="/story/classic"><ClassicResult /></Route>
            }
            {import.meta.env.DEV &&
              <Route exact path="/story/duet"><DuetResult /></Route>
            }
            <Route exact path="/howto"><HowTo/></Route>
            <Route exact path="/moregames"><MoreGames/></Route>
            <Route exact path="/feedback"><SubmitFeedback/></Route>
            <Route exact path="/:urlgamecode" component={App}></Route>
            <Route path="/" component={App}></Route>
          </Switch>
        </div>

        <Footer/>
      </PreferencesContextProvider>
    </Router>
  );
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
}

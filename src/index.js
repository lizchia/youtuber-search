import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import './index.css';
import App from './App';
import NoLogin from './NoLogin';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Switch from 'react-bootstrap/esm/Switch';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Link to="/App">Login</Link>
        <span>/</span>
        <Link to="/NoLogin">Nologin</Link>
      </div>
      <Switch>
        <Route path="/App">
          <App />
        </Route>
        <Route path="/NoLogin">
          <NoLogin />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

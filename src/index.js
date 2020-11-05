import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import './index.css';
import App from './App';
import NoLogin from './NoLogin';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from 'react-bootstrap';

ReactDOM.render(
  // <Nav>
  //   <a href="/APP">Login</a>
  //   <a href="/NOLOGIN">No login</a>
  // </Nav>,
  <React.StrictMode>
    <a href="/APP">
      <App />
    </a>
    <a href="/NOLOGIN">
      <NoLogin />
    </a>
  </React.StrictMode>,
  document.getElementById('root')
);

export function Na() {
  return (
    <React.StrictMode>
      <a href="/APP">
        <App />
      </a>
      <a href="/NOLOGIN">
        <NoLogin />
      </a>
    </React.StrictMode>
  );
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Settings from "./screens/settings"
import Help from "./screens/help"


import Home from './screens/home';
import ListOfThings from './screens/list';
import "./App.css"

ReactDOM.render((
  <BrowserRouter>
    <div>
      <nav className="container">
        <ul className="nav mt-2 mb-2">
          <li className="nav-item">
            <Link className="nav-link" to="/">Dashboard</Link>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="/list">List</Link>
          </li> */}
          <li className="nav-item">
            <Link className="nav-link" to="/help">Help</Link>
          </li>
        </ul>
      </nav>
    
      <Switch>
        <Route exact path="/list" component={ ListOfThings } />
        <Route exact path="/help" component={Help} />

        <Route component={ Settings } />
      </Switch>
    </div>
  </BrowserRouter>
), document.getElementById('root'));

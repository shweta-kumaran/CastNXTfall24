// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "@hotwired/turbo-rails"
// import "components"

// import React from 'react'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './Main.css';
import "bootstrap/dist/css/bootstrap.min.css";
// import Main from './Main'

document.title = "CASTNXT"

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main name="CASTNXT" />,
    document.body.appendChild(document.createElement('div')),
  )
})

// import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Redirect
} from "react-router-dom";

import Homepage from './components/Home/Homepage';
import LandingPage from './components/LandingPage/LandingPage';
import UserHomepage from './components/User/UserHomepage';
import UserEventRegister from './components/User/UserEventRegister';
import AdminHomepage from './components/Admin/AdminHomepage';
import AdminCreateEvent from './components/Admin/AdminCreateEvent';
import AdminCreateStack from './components/Admin/AdminCreateStack';
import AdminCreateClientStack from './components/Admin/AdminCreateClientStack';
import AdminEventPage from './components/Admin/AdminEventPage';
import ClientHomepage from './components/Client/ClientHomepage';
import ClientEventPage from './components/Client/ClientEventPage';

class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <div className="overflow-auto" style={{ "paddingTop": "1%" }}>
          <Router>
            <Routes>
              <Route exact path="/user/events/*" render= {() => <UserEventRegister />} />
              <Route exact path="/user" render= {() => <UserHomepage />} />
              <Route exact path="/admin/events/new" render= {() => <AdminCreateEvent />} />
              <Route exact path="/admin/events/*" render= {() => <AdminEventPage />} />
              <Route exact path="/admin" render= {() => <AdminHomepage />} />
              <Route exact path="/client/events/*" render= {() => <ClientEventPage />} />
              <Route exact path="/client" render= {() => <ClientHomepage />} />
              <Route exact path="/home" render= {() => <Homepage />} />
            </Routes>
          </Router>
        </div>
      </div>
    );
  }
}
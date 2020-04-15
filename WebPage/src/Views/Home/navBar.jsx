import React, { Component } from "react";
import "./Home.css";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";
import Dashboard from "./Routes/Dashboard/dashboard";
import logo from "../../img/jude1.png";
import Orders from "./Routes/Orders/orders";
import NotesDetail from "./Routes/Dashboard/noteDetaile";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      currRoute: "home",
    };
  }

  setCurrentDashboard = (e) => {
    this.setState({ currRoute: "home" });
  };
  setCurrentAddVendor = (e) => {
    this.setState({ currentRoute: "profile" });
  };

  render() {
    const { currRoute } = this.state;
    const { Notes } = this.props;
    let NavBarHandle;
    if (currRoute === "home") {
      NavBarHandle = "DashboardRouteHandle";
    } else {
      NavBarHandle = "AddVendorRouteHandle";
    }
    return (
      <div className="MainScreen">
        <Router>
          <div style={{ display: "flex" }}>
            <div
              style={{
                padding: "0%",
                height: "60px",
                width: "100%",
                backgroundColor: "white",
                borderBottom: "3px solid lightgrey",
              }}
            >
              <img src={logo} className="Logo" alt="Logo" />
              <NavLink
                exact
                to="/Home"
                className="DashboardRoute"
                activeClassName="DashboardRouteActive"
              >
                Home
              </NavLink>
              <NavLink
                exact
                to="/Profile"
                className="AddVendorRoute"
                activeClassName="AddVendorRouteActive"
              >
                New Recording
              </NavLink>
              <Switch>
                <Route path="/home">
                  <Dashboard Notes={Notes} />
                </Route>
                <Route path="/profile">
                  <Orders />
                </Route>
                <Route path="/note/:id" component={NotesDetail}></Route>
                <Redirect to="/home" />
              </Switch>
              <div classname={NavBarHandle} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default NavBar;

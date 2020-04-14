import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Container from "./components/container";
import "../../Home.css";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { Notes } = this.props;
    console.log(Notes.Notes);
    if (Notes !== null) {
      return (
        <div className="Dashboard">
          <div className="Container">
            <div className="VendorsContainer">
              <ul className="VendorsList">
                {Notes.Notes &&
                  Notes.Notes.map((note) => {
                    return (
                      <Link to={"/note/" + note.id} className="VendorItem">
                        <Container data={note} />
                      </Link>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Dashboard;

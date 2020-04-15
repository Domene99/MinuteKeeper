import React, { Component } from "react";
import NoteConatiner from "../Dashboard/components/notesContainer";
import "../../Home.css";

class NotesDetail extends Component {
  render() {
    const {
      match: { params },
    } = this.props;
    console.log(params);
    return (
      <div className="Dashboard">
        <NoteConatiner />
      </div>
    );
  }
}

export default NotesDetail;

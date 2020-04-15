import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import NoteConatiner from "../Dashboard/components/notesContainer";
import "../../Home.css";

class NotesDetail extends Component {
  state = { Notes: [] };
  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    console.log(params.id);
    const query =
      `
query{
  listTodos(filter:{id:{contains:"` +
      params.id +
      `"}}){
    items {
      id name description email
    }
  }
}`;
    console.log(query);
    const data = await API.graphql(graphqlOperation(query));
    this.setState({ Notes: data.data.listTodos.items });
  }
  render() {
    console.log(this.state);
    return (
      <div className="Dashboard">
        <NoteConatiner />
      </div>
    );
  }
}

export default NotesDetail;

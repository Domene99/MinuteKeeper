import React, { Component } from "react";
import "./App.css";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";
import Home from "./Views/Home/navBar";
import "@aws-amplify/ui/dist/style.css";
import { API, graphqlOperation } from "aws-amplify";
Amplify.configure(aws_exports);

const query = `
query{
  listTodos{
    items {
      id name description email
    }
  }
}`;

class App extends Component {
	state = { Notes: [] };
	async componentDidMount() {
		const data = await API.graphql(graphqlOperation(query));
		this.setState({ Notes: data.data.listTodos.items });
	}
	render() {
		const Notes = this.state;
		return <Home Notes={Notes} />;
	}
}

export default withAuthenticator(App);

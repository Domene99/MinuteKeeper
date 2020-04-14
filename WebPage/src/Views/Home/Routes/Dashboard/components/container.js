import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: "300px",
      height: theme.spacing(35),
    },
  },
}));

export default function SimplePaper({ data }) {
  const classes = useStyles();
  console.log(data.data);
  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className="notesName">{data.name}</div>
        <div className="notesDescription">{data.description}</div>
      </Paper>
    </div>
  );
}

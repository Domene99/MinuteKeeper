import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(4),
      width: theme.spacing(400),
      height: theme.spacing(100),
    },
  },
}));

export default function SimplePaper({ data }) {
  const classes = useStyles();
  //   console.log(data.data);
  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        {/* <div className="notesName">{data.name}</div>
        <div className="notesDescription">{data.description}</div> */}
      </Paper>
    </div>
  );
}

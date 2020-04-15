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
  const json = JSON.parse(data.data);
  let full_text = "";
  let full_size = 0;
  let due = [];
  let past = [];
  let info = [json.info[0].general_topic, json.info[0].language, json.info[0].morale];
  let key_topics = [];

  for (const el of json.chunks) {
    full_text += el.text;
    full_size += parseInt(el.size);
  }

  for (const el of json.due) {
    let due_info = new Array(4);
    let date_string = '' + el.year + '-' + el.month + '-' + el.day + 'T' + el.hour + ':00:00-05:00'; // 2020-06-15T12:00:00-05:00
    // let date = new Date(date_string);
    due_info[0] = el.full_sentence;
    due_info[1] = el.date_keyword;
    due_info[2] = date_string;
    due_info[3] = el.link; // google drive calendar link
    due.push(due_info);
  }

  for (const el of json.past) {
    let past_info = new Array(3);
    let date_string = '' + el.year + '-' + el.month + '-' +
 el.day + 'T' + el.hour + ':00:00-05:00';
    // let date = new Date(date_string);
    due_info[0] = el.full_sentence;
    due_info[1] = el.date_keyword;
    due_info[2] = date_string;
    due.push(due_info);
  }

  for (const el of json.key_topics) {
    key_topics.push(el.most_repeated_key_word);
  }

  console.log(due_info);
  console.log(past_info);
  console.log(key_topics);
  console.log(info);
  console.log(full_size);

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        {/* <div className="notesName">{data.name}</div>
        <div className="notesDescription">{data.description}</div> */}
      </Paper>
    </div>
  );
}

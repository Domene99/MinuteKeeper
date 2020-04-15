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
  const json = JSON.parse(data[0].data);
  let full_text = "";
  let full_size = 0;
  let due = [];
  let past = [];
  let info = [
    json.info[0].general_topic,
    json.info[0].language,
    json.info[0].morale,
  ];
  let key_topics = [];

  for (let el of json.chunks) {
    full_text += el.text;
    full_size += parseInt(el.size);
  }

  for (let el of json.due) {
    let date_string =
      "" +
      el.year +
      "-" +
      el.month +
      "-" +
      el.day +
      "Time: " +
      el.hour +
      ":00:00-05:00";
    due.push([el.full_sentence, el.date_keyword, date_string, el.cal_link]);
  }

  for (let el of json.past) {
    let date_string =
      "" +
      el.year +
      "-" +
      el.month +
      "-" +
      el.day +
      "Time: " +
      el.hour +
      ":00:00-05:00";
    past.push([el.full_sentence, el.date_keyword, date_string]);
  }

  for (let el of json.key_topics) {
    key_topics.push(el.most_repeated_key_word);
  }

  console.log(due);
  console.log(past);
  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className="MainNoteContainer">
          <div className="title">Main Subject</div>
          {info[0]}
          <div className="title">Overview of Meeting</div>
          Language: {info[1]} Morale: {info[2]}
          <div className="title">Due Activities </div>
          {due &&
            due.map((note) => {
              console.log(note);
              return (
                <div className="due">
                  <div>{note[0]}</div>
                  <div>{note[1]}</div>
                  <div>{note[2]}</div>
                  <a href={note[3]}>{note[3]}</a>
                </div>
              );
            })}
          <div className="title">Past Activities</div>
          {past &&
            past.map((note) => {
              return <div>{note}</div>;
            })}
        </div>
      </Paper>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { TextField, makeStyles } from "@material-ui/core";
import config from "../config/config";
import { ComponentType } from "../App";
import Feedback from "../types/Feedback";
import { withRouter, RouteComponentProps } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  elementContainer: {
    display: "flex",
    width: "100%",
  },
  poster: {
    width: "35%",
    marginRight: "16px",
    objectFit: "contain",
    maxHeight: "14rem",
  },
  feedbackContainer: {
    display: "flex",
    flexDirection: "column",
    width: "65%",
  },
  textField: {
    width: "100%",
  },
}));

async function fetchFeedbacksPromise() {
  const response = await fetch(`${config.serverURL}/film/feedbacks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong.");
  return json as Feedback[];
}

const FeedbackList: React.FunctionComponent<
  RouteComponentProps & ComponentType
> = (props) => {
  const classes = useStyles();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const fetchFeedbacks = async () => {
    try {
      const data = await fetchFeedbacksPromise();
      setFeedbacks(data);
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div>
      <h1>Feedbacks</h1>
      <div>
        {feedbacks.map((feedback, index) => (
          <div key={index}>
            <h2>{feedback.title}</h2>
            <div className={classes.elementContainer}>
              <img
                onClick={() => props.history.push("/movie/" + feedback.filmID)}
                className={classes.poster}
                src={"https://image.tmdb.org/t/p/w1280" + feedback.poster_path}
              ></img>
              <div className={classes.feedbackContainer}>
                {feedback.review && (
                  <TextField
                    className={classes.textField}
                    defaultValue={feedback.review}
                    multiline
                    rows={6}
                    disabled
                  ></TextField>
                )}
                <h3 style={{ marginTop: "16px" }}>Rating: {feedback.rating}</h3>
                <p>Status: {feedback.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRouter(FeedbackList);

import React, { useState, useEffect } from "react";
import { ComponentType } from "../App";
import { TextField, Button, makeStyles } from "@material-ui/core";
import config from "../config/config";
import Feedback, { FeedbackStatus } from "../types/Feedback";
import { withRouter, RouteComponentProps } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "16px",
    width: "100%",
    height: "100%",
  },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
  },
  logoutBtn: {
    maxHeight: "32px",
  },
  textArea: {
    width: "100%",
  },
  btnsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: "16px",
  },
}));

async function fetchPendingFeedbacksPromise() {
  const response = await fetch(`${config.serverURL}/film/feedback/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as Feedback[];
}

async function updateFeedbackStatusPromise(
  feedbackID: string,
  status: FeedbackStatus
) {
  const response = await fetch(
    `${config.serverURL}/film/feedback/${feedbackID}/${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as Feedback;
}

const AdminSection: React.FunctionComponent<
  RouteComponentProps & ComponentType
> = (props) => {
  const classes = useStyles();
  const [pendingFeedbacks, setPendingFeedbacks] = useState<Feedback[]>([]);

  const fetchPendingFeedbacks = async () => {
    try {
      const feedbacks = await fetchPendingFeedbacksPromise();
      setPendingFeedbacks(feedbacks);
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  const updateFeedbackStatus = async (
    feedbackID: string,
    status: FeedbackStatus
  ) => {
    try {
      await updateFeedbackStatusPromise(feedbackID, status);
      const filteredFeedbacks = pendingFeedbacks.filter(
        (x) => x._id !== feedbackID
      );
      setPendingFeedbacks(filteredFeedbacks);
      props.snackbar("Feedback status updated successfully", "success");
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    props.history.push("/login");
  };

  useEffect(() => {
    fetchPendingFeedbacks();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.titleSection}>
        <h1>Reviews to Authorize</h1>
        <Button className={classes.logoutBtn} onClick={() => logout()}>
          Logout
        </Button>
      </div>
      {pendingFeedbacks.length > 0 ? (
        pendingFeedbacks.map((feedback, index) => (
          <div key={index}>
            <h2>{`User ${feedback.userID} Review of ${feedback.title}`}</h2>
            <TextField
              className={classes.textArea}
              id="outlined-multiline-static"
              label="Review"
              placeholder="Write your review here"
              multiline
              rows={4}
              variant="outlined"
              defaultValue={feedback.review}
              onChange={(e) => {}}
              disabled
            />
            <div className={classes.btnsContainer}>
              <Button
                onClick={() => updateFeedbackStatus(feedback._id!, "rejected")}
              >
                Reject
              </Button>
              <Button
                onClick={() => updateFeedbackStatus(feedback._id!, "accepted")}
              >
                Accept
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h2>No pending feedbacks to review</h2>
        </div>
      )}
    </div>
  );
};

export default withRouter(AdminSection);

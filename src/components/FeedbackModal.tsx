import React, { useState, FunctionComponent } from "react";
import {
  makeStyles,
  Modal,
  Fade,
  TextField,
  Button,
  Backdrop,
} from "@material-ui/core";
import { FeedbackStatus } from "../types/Feedback";
import { ComponentType } from "../App";

type FeedbackModalType = {
  rating: number;
  review: string;
  status: FeedbackStatus;
  filmTitle: string;
  onClose: () => void;
  onSave: (review: string, rating: number) => void;
  onRemove: () => void;
  showModal: boolean;
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  paper: {
    padding: "16px",
    border: "2px solid #000",
    background: theme.palette.primary.dark,
    minWidth: "50%",
  },
  modalTextField: {
    width: "100%",
  },
  modalButtonsContainer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "center",
  },
  ratingBox: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "max-content",
    "& > :not(:last-child)": {
      marginRight: "8px",
    },
  },

  rating: {
    border: "1px solid white",
    minWidth: "3rem",
    maxWidth: "3rem",
    background: "transparent",
    minHeight: "3rem",
    maxHeight: "3rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "background 0.2s ease-in-out",
    fontSize: "1.2rem",
  },
}));

const FeedbackModal: FunctionComponent<FeedbackModalType & ComponentType> = (
  props
) => {
  const classes = useStyles();
  const [review, setReview] = useState(props.review);
  const [rating, setRating] = useState(props.rating);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={() => props.onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <div className={classes.titleContainer}>
            <h2 id="transition-modal-title">{props.filmTitle}</h2>
            <p>{props.status}</p>
          </div>
          <TextField
            className={classes.modalTextField}
            id="outlined-multiline-static"
            label="Review"
            placeholder="Write your review here"
            multiline
            rows={4}
            variant="outlined"
            defaultValue={review}
            onChange={(e) => setReview(e.currentTarget.value)}
          />
          <div style={{ marginTop: "16px", overflowX: "auto" }}>
            <div className={classes.ratingBox}>
              {Array(10)
                .fill(0, 0, 10)
                .map((num, index) => (
                  <div
                    className={classes.rating}
                    style={
                      rating === 10 - index
                        ? { background: "#304ffe", border: "1px solid #005cb2" }
                        : {}
                    }
                    onClick={() => {
                      const newRating = 10 - index;
                      if (newRating !== rating) setRating(newRating);
                      else setRating(-1);
                    }}
                    key={10 - index}
                  >
                    {10 - index}
                  </div>
                ))}
            </div>
          </div>
          <div className={classes.modalButtonsContainer}>
            <Button
              style={{ marginRight: "16px" }}
              onClick={() => props.onClose()}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (rating > 0 || review !== "") props.onSave(review, rating);
                else props.onRemove();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default FeedbackModal;

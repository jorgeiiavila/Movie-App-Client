import React, { FunctionComponent, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Film } from "../types/Film";
import { makeStyles, Button, useMediaQuery } from "@material-ui/core";
import CastAndCrewItem from "./CastAndCrewItem";
import { Crew, CastAndCrew } from "../types/CastAndCrew";
import FeedbackModal from "./FeedbackModal";
import config from "../config/config";
import { ComponentType } from "../App";
import moment from "moment";
import { ListType, ListItem } from "../types/ListItem";
import Feedback, { FeedbackStatus } from "../types/Feedback";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    margin: "-16px",
    height: "100%",
  },
  movieDataContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  backDropPicture: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  mainContainer: {
    padding: "16px",
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    // backdropFilter: "blur(11px)",
    background: "rgba(0, 0, 0, 0.65)",
  },
  movieMainInfoContainer: {
    width: "50%",
    height: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImg: {
    maxHeight: "20rem",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    marginTop: "16px",
    display: "flex",
    "& > :not(:last-child)": {
      marginRight: "1rem",
    },
    "& > button": {
      maxHeight: "40px",
    },
    alignItems: "center",
  },
  selectedBtn: {
    background: "#304ffe",
  },
  secondaryInfoContainer: {
    padding: "16px",
    width: "50%",
    height: "100%",
  },
  genresContainer: {
    display: "flex",
    "& > :not(:last-child)": {
      marginRight: "8px",
    },
  },
  castAndCrew: {
    width: "100%",
  },
  castAndCrewWrapper: {
    overflowX: "auto",
  },
  castAndCrewContainer: {
    marginTop: "8px",
    width: "max-content",
    display: "flex",
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  // Mobile version classes
  mainContainerMobile: {
    flexDirection: "column",
    height: "max-content",
  },
  infoContainerMobile: {
    width: "100%",
    height: "unset",
  },
}));

function getDirectorAndScreenwriter(crew: Crew[]): Crew[] {
  const filteredCrew = crew.filter(
    (x) => x.job === "Director" || x.job === "Screenplay"
  );

  if (filteredCrew.length > 1 && filteredCrew[0].id === filteredCrew[1].id) {
    return [
      {
        ...filteredCrew[0],
        job: `${filteredCrew[0].job} ${filteredCrew[1].job}`,
      },
    ];
  }
  return filteredCrew;
}

async function fetchFilmPromise(id: number) {
  const response = await fetch(config.serverURL + "/film/load/" + id, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");

  return json as {
    film: Film;
    castAndCrew: CastAndCrew;
    feedback: Feedback;
    isToWatch: boolean;
    isFavorite: boolean;
  };
}

async function addToListPromise(
  filmID: number,
  title: string,
  poster_path: string,
  listType: ListType
) {
  const listItem: ListItem = {
    title,
    poster_path,
    filmID,
  };

  const response = await fetch(config.serverURL + "/film/list/" + listType, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listItem),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");

  return json as ListItem;
}

async function removeFromListPromise(filmID: number, listType: ListType) {
  const response = await fetch(
    `${config.serverURL}/film/list/${listType}/${filmID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as number;
}

async function postFeedbackPromise(feedback: Feedback) {
  const URL = feedback._id
    ? `${config.serverURL}/film/feedback/${feedback._id}`
    : `${config.serverURL}/film/feedback`;
  const method = feedback._id ? "PATCH" : "POST";
  const response = await fetch(URL, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as Feedback;
}

type MovieDetailParams = {
  id: string;
};

type MovieDetailType = RouteComponentProps<MovieDetailParams> & ComponentType;

const MovieDetail: FunctionComponent<MovieDetailType> = (props) => {
  const filmID = Number(props.match.params.id);

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:900px)");

  const [filmData, setFilmData] = useState<{
    film: Film;
    castAndCrew: CastAndCrew;
    feedback: Feedback;
  }>();
  const [isToWatch, setIsToWatch] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchFilm = async (id: number) => {
    try {
      const data = await fetchFilmPromise(id);
      data.feedback = data.feedback
        ? data.feedback
        : {
            filmID,
            poster_path: data.film.poster_path,
            review: "",
            rating: -1,
            title: data.film.title,
            status: "pending",
          };
      setFilmData(data);
      setIsToWatch(data.isToWatch);
      setIsWatched(!!data.feedback._id);
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error(err);
      props.snackbar(err.message, "error");
    }
  };

  const addToList = async (
    filmID: number,
    title: string,
    poster_path: string,
    listType: ListType
  ) => {
    try {
      await addToListPromise(filmID, title, poster_path, listType);
      if (listType === "toWatch") setIsToWatch(true);
      else if (listType === "watched") setIsWatched(true);
      else setIsFavorite(true);
      props.snackbar("Added to list successfully", "success");
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  const removeFromList = async (filmID: number, listType: ListType) => {
    try {
      await removeFromListPromise(filmID, listType);
      if (listType === "toWatch") setIsToWatch(false);
      else if (listType === "watched") setIsWatched(false);
      else setIsFavorite(false);
      props.snackbar("Removed from list successfully", "success");
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  const postFeedback = async (feedback: Feedback) => {
    try {
      const data = await postFeedbackPromise(feedback);
      setFilmData({ ...filmData!, feedback: data });
      setIsWatched(true);
      props.snackbar("Feedback posted successfully", "success");
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  useEffect(() => {
    fetchFilm(filmID);
    // setFilmData(testData);
  }, []);

  if (!filmData) return null;
  return (
    <div className={classes.root}>
      <div className={classes.movieDataContainer}>
        <img
          className={classes.backDropPicture}
          src={"https://image.tmdb.org/t/p/w1280" + filmData.film.backdrop_path}
        ></img>
        <div
          className={`${classes.mainContainer} ${
            matches ? classes.mainContainerMobile : null
          }`}
        >
          <div
            className={`${classes.movieMainInfoContainer} ${
              matches ? classes.infoContainerMobile : null
            }`}
          >
            <div>
              <img
                className={classes.posterImg}
                src={
                  "https://image.tmdb.org/t/p/w1280" + filmData.film.poster_path
                }
              ></img>
            </div>
            <div className={classes.titleContainer}>
              <h1>{filmData.film.title}</h1>
            </div>
            <div>{filmData.film.overview}</div>
            <div className={classes.buttonsContainer}>
              <Button
                className={isToWatch ? classes.selectedBtn : ""}
                onClick={() => {
                  const filmID = filmData.film.id;
                  const title = filmData.film.title;
                  const poster_path = filmData.film.poster_path;
                  if (isToWatch) removeFromList(filmID, "toWatch");
                  else addToList(filmID, title, poster_path, "toWatch");
                }}
              >
                To Watch
              </Button>
              <Button
                className={isWatched ? classes.selectedBtn : ""}
                onClick={() => setShowModal(true)}
              >
                Watched
              </Button>
              <Button
                className={isFavorite ? classes.selectedBtn : ""}
                onClick={() => {
                  const filmID = filmData.film.id;
                  const title = filmData.film.title;
                  const poster_path = filmData.film.poster_path;
                  if (isFavorite) removeFromList(filmID, "favorites");
                  else addToList(filmID, title, poster_path, "favorites");
                }}
              >
                Favorite
              </Button>
            </div>
          </div>

          <div
            className={`${classes.secondaryInfoContainer} ${
              matches ? classes.infoContainerMobile : null
            }`}
          >
            <div
              style={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ width: "100%" }}>
                <h2>Runtime</h2>
                <div>{filmData.film.runtime + " min"}</div>
                <h2>Genres</h2>
                <div>
                  {filmData.film.genres.map((genre) => genre.name).join(", ")}
                </div>
                <h2>Release Date</h2>
                <div>
                  {moment(filmData.film.release_date).format("DD-MMMM-YYYY")}
                </div>
              </div>
              <div className={classes.castAndCrew}>
                <h2>Cast And Crew</h2>
                <div className={classes.castAndCrewWrapper}>
                  <div className={classes.castAndCrewContainer}>
                    {getDirectorAndScreenwriter(filmData.castAndCrew.crew).map(
                      (crew) => (
                        <CastAndCrewItem
                          key={crew.credit_id}
                          name={crew.name}
                          role={crew.job}
                          profile_path={crew.profile_path}
                        ></CastAndCrewItem>
                      )
                    )}
                    {filmData.castAndCrew.cast.slice(0, 20).map((cast) => (
                      <CastAndCrewItem
                        key={cast.cast_id}
                        name={cast.name}
                        role={cast.character}
                        profile_path={cast.profile_path}
                      ></CastAndCrewItem>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal
        review={filmData.feedback.review}
        rating={filmData.feedback.rating}
        status={filmData.feedback.status}
        filmTitle={filmData.film.title}
        onClose={() => setShowModal(false)}
        onSave={(review: string, rating: number) => {
          const newFeedback = {
            ...filmData.feedback,
            review,
            rating,
            status: review
              ? ("pending" as FeedbackStatus)
              : ("accepted" as FeedbackStatus),
          };
          setFilmData({ ...filmData, feedback: newFeedback });
          postFeedback(newFeedback);
          setShowModal(false);
        }}
        snackbar={props.snackbar}
        showModal={showModal}
      />
    </div>
  );
};

export default withRouter(MovieDetail);

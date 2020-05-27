import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ComponentType } from "../App";
import { ListType, ListItem } from "../types/ListItem";
import { makeStyles } from "@material-ui/core";
import config from "../config/config";

const useStyles = makeStyles((theme) => ({
  searchInputContainer: {
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    minWidth: "100%",
  },
  searchContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(142px, 1fr));",
    columnGap: "4px",
    marginTop: "16px",
  },
  poster: {
    maxHeight: "20rem",
    maxWidth: "100%",
  },
}));

function getListTypeLabel(listType: ListType) {
  if (listType === "toWatch") return "To Watch";
  else if (listType === "watched") return "Watched";
  return "Favorites";
}

async function fetchListPromise(listType: ListType) {
  const response = await fetch(`${config.serverURL}/film/list/${listType}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as ListItem[];
}

type MovieListType = RouteComponentProps &
  ComponentType & {
    listType: ListType;
  };

const MovieList: React.FunctionComponent<MovieListType> = (props) => {
  const classes = useStyles();
  const listType = props.listType;
  const [list, setList] = useState<ListItem[]>([]);

  const fetchList = async (listType: ListType) => {
    try {
      const data = await fetchListPromise(listType);
      setList(data);
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  useEffect(() => {
    fetchList(listType);
  }, []);

  return (
    <div>
      <h1>{getListTypeLabel(listType)}</h1>
      <div className={classes.searchContainer}>
        {list.map((listItem) => (
          <div
            key={listItem.filmID}
            onClick={() => props.history.push("/movie/" + listItem.filmID)}
          >
            <img
              alt="Poster"
              className={classes.poster}
              src={"https://image.tmdb.org/t/p/w1280" + listItem.poster_path}
            ></img>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRouter(MovieList);

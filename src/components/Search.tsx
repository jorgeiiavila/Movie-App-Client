import React, { useState, useRef } from "react";
import { TextField, makeStyles } from "@material-ui/core";
import { Search } from "../types/Film";
import { RouteComponentProps, withRouter } from "react-router-dom";
import config from "../config/config";
import { ComponentType } from "../App";
import * as _ from "lodash";

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

async function fetchSearchPromise(query: string) {
  const response = await fetch(
    config.serverURL + "/film/search?query=" + query,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json as Search;
}

const SearchPage: React.FunctionComponent<
  RouteComponentProps & ComponentType
> = (props) => {
  const classes = useStyles();
  const [search, setSearch] = useState<Search>();
  const timeout = 1500;
  const debouncedFn = useRef(
    _.debounce((query: string) => fetchSearch(query), timeout)
  );

  const fetchSearch = async (query: string) => {
    try {
      const data = await fetchSearchPromise(query);
      setSearch(data);
    } catch (err) {
      props.snackbar(err.message, "error");
    }
  };

  return (
    <div>
      <h1>Search Movie</h1>
      <div className={classes.searchInputContainer}>
        <TextField
          className={classes.searchInput}
          placeholder="Search"
          onChange={(e) => {
            e.persist();
            const query = e.currentTarget.value;
            if (query) debouncedFn.current(query);
          }}
        ></TextField>
      </div>

      {!search ? null : (
        <div className={classes.searchContainer}>
          {search.results.map((film) => (
            <div
              key={film.id}
              onClick={() => props.history.push("/movie/" + film.id)}
            >
              <img
                alt="Poster"
                className={classes.poster}
                src={"https://image.tmdb.org/t/p/w1280" + film.poster_path}
              ></img>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withRouter(SearchPage);

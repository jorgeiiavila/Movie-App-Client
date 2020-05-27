import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme/theme";

// Components
import Core from "./components/Core";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MovieDetail from "./components/MovieDetail";
import Search from "./components/Search";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import MovieList from "./components/MovieList";
import AdminSection from "./components/AdminSection";

type SnackbarType = "error" | "info" | "success" | "warning";

export type ComponentType = {
  snackbar: (message: string, type: SnackbarType) => void;
};

function App() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType>("success");

  const snackbar = (message: string, type: SnackbarType) => {
    setShowSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarType(type);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ width: "inherit", height: "inherit" }}>
          <Switch>
            <Route
              path="/login"
              render={() =>
                !isUserLogged() ? (
                  <Login snackbar={snackbar}></Login>
                ) : (
                  <Redirect
                    to={{
                      pathname: "/",
                    }}
                  ></Redirect>
                )
              }
            ></Route>
            <Route
              path="/signup"
              render={() =>
                !isUserLogged() ? (
                  <SignUp snackbar={snackbar}></SignUp>
                ) : (
                  <Redirect
                    to={{
                      pathname: "/",
                    }}
                  ></Redirect>
                )
              }
            ></Route>
            <Route
              render={() =>
                isUserLogged() ? (
                  getUserType() === "admin" ? (
                    <AdminSection snackbar={snackbar}></AdminSection>
                  ) : (
                    <Core snackbar={snackbar}>
                      <div style={{ height: "100%" }}>
                        <Route path="/search">
                          <Search snackbar={snackbar} />
                        </Route>
                        <Route path="/movie/:id">
                          <MovieDetail snackbar={snackbar} />
                        </Route>
                        <Route path="/movie_list/toWatch">
                          <MovieList
                            listType="toWatch"
                            snackbar={snackbar}
                          ></MovieList>
                        </Route>
                        <Route path="/movie_list/watched">
                          <MovieList
                            listType="watched"
                            snackbar={snackbar}
                          ></MovieList>
                        </Route>
                        <Route path="/movie_list/favorites">
                          <MovieList
                            listType="favorites"
                            snackbar={snackbar}
                          ></MovieList>
                        </Route>
                      </div>
                    </Core>
                  )
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  ></Redirect>
                )
              }
              path="/"
            ></Route>
          </Switch>
          <Snackbar
            open={showSnackbar}
            autoHideDuration={4000}
            onClose={() => {
              setShowSnackbar(false);
              setSnackbarMessage("");
            }}
          >
            <Alert
              onClose={() => {
                setShowSnackbar(false);
                setSnackbarMessage("");
              }}
              severity={snackbarType}
              elevation={6}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function isUserLogged() {
  const userLogged = localStorage.getItem("token") !== null;
  return userLogged;
}

function getUserType() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return "";
  const user = JSON.parse(userStr);
  return user.type as string;
}

export default App;

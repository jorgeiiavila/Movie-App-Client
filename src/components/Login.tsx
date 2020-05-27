import React, { useState } from "react";
import { Button, TextField, makeStyles } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ComponentType } from "../App";
import config from "../config/config";
import User from "../types/User";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "inherit",
    width: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "17rem",
    textAlign: "center",
    "& > :not(:first-child)": {
      marginTop: "1rem",
    },
  },
}));

async function login(username: string, password: string) {
  const response = await fetch(config.serverURL + "/user/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const json = await response.json();

  if (!response.ok) throw new Error((json as { message: string }).message);

  return json as { user: User; token: string };
}

type LoginParams = {};

type LoginType = RouteComponentProps<LoginParams> & ComponentType;

const Login: React.FunctionComponent<LoginType> = (props) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={classes.root}>
      <div className={classes.loginContainer}>
        <h1>Login</h1>
        <TextField
          label="Username"
          onChange={(e) => setUsername(e.currentTarget.value)}
        ></TextField>
        <TextField
          label="Password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
        ></TextField>
        <Button
          onClick={async () => {
            try {
              const data = await login(username, password);
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              props.history.push("/");
            } catch (err) {
              props.snackbar(err.message, "error");
            }
          }}
        >
          Login
        </Button>
        <p>Do not have an account?</p>
        <Button onClick={() => props.history.push("/signup")}>Sign Up</Button>
      </div>
    </div>
  );
};

export default withRouter(Login);

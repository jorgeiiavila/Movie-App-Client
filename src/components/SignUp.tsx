import React, { useState } from "react";
import { makeStyles, TextField, Button } from "@material-ui/core";
import User from "../types/User";
import config from "../config/config";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ComponentType } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "inherit",
    width: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "17rem",
    textAlign: "center",
    "& > :not(:first-child)": {
      marginTop: "1rem",
    },
  },
}));

function validateEmail(email: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

async function register(user: User) {
  const response = await fetch(config.serverURL + "/user/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Something went wrong");
}

type SignUpParams = {};

type SignUpType = RouteComponentProps<SignUpParams> & ComponentType;

const SignUp: React.FunctionComponent<SignUpType> = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState<User>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showErrors, setShowErrors] = useState(false);

  return (
    <form className={classes.root}>
      <div className={classes.signUpContainer}>
        <h1>Sign Up</h1>
        <TextField
          error={!user.name && showErrors}
          label="Name"
          required
          helperText={!user.name && showErrors ? "Required Field" : null}
          onChange={(e) => setUser({ ...user, name: e.currentTarget.value })}
        ></TextField>
        <TextField
          error={!user.username && showErrors}
          label="Username"
          required
          helperText={!user.username && showErrors ? "Required Field" : null}
          onChange={(e) =>
            setUser({ ...user, username: e.currentTarget.value })
          }
        ></TextField>
        <TextField
          error={(!user.email || !validateEmail(user.email)) && showErrors}
          label="Email"
          required
          helperText={
            !user.email && showErrors
              ? "Required Field"
              : !validateEmail(user.email) && showErrors
              ? "Invalid email"
              : null
          }
          onChange={(e) => setUser({ ...user, email: e.currentTarget.value })}
          type="email"
        ></TextField>
        <TextField
          error={
            (!user.password || user.password !== user.confirmPassword) &&
            showErrors
          }
          label="Password"
          type="password"
          required
          helperText={
            showErrors && !user.password
              ? "Required Field"
              : showErrors && user.password !== user.confirmPassword
              ? "Password Mismatch"
              : ""
          }
          onChange={(e) =>
            setUser({ ...user, password: e.currentTarget.value })
          }
        ></TextField>
        <TextField
          error={
            (!user.confirmPassword || user.confirmPassword !== user.password) &&
            showErrors
          }
          label="Confirm Password"
          type="password"
          required
          helperText={
            showErrors && !user.confirmPassword
              ? "Required Field"
              : showErrors && user.password !== user.confirmPassword
              ? "Password Mismatch"
              : ""
          }
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.currentTarget.value })
          }
        ></TextField>
        <Button
          onClick={async () => {
            const allFieldsFilled =
              user.name !== "" &&
              user.username !== "" &&
              user.email !== "" &&
              user.password !== "" &&
              user.confirmPassword !== "";

            const passwordsMatch = user.password === user.confirmPassword;

            if (!allFieldsFilled || !passwordsMatch) {
              setShowErrors(true);
              props.snackbar("Please complete the form", "error");
              return;
            }

            try {
              await register(user);
              props.snackbar("User created successfully", "success");
              props.history.push("/login");
            } catch (err) {
              props.snackbar(err.message, "error");
            }
          }}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default withRouter(SignUp);

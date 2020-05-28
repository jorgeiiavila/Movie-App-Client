import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ComponentType } from "../App";
import config from "../config/config";
import { Button, useMediaQuery } from "@material-ui/core";
import User from "../types/User";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    marginTop: "64px",
    padding: "16px",
    height: "100%",
  },
  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    "& > :not(:first-child)": {
      marginTop: "16px",
    },
  },
  userImage: {
    minWidth: "6rem",
    minHeight: "6rem",
    width: "6rem",
    height: "6rem",
    borderRadius: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    background: theme.palette.secondary.main,
  },
}));

const Core: React.FunctionComponent<RouteComponentProps & ComponentType> = (
  props
) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:599px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")!) as User;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    props.history.push("/login");
  };

  const drawerElements = [
    {
      label: "To Watch",
      icon: <ListIcon />,
      onClick: () => props.history.push("/movie_list/toWatch"),
    },
    {
      label: "Watched",
      icon: <VisibilityIcon />,
      onClick: () => props.history.push("/movie_list/watched"),
    },
    {
      label: "Favorites",
      icon: <FavoriteIcon />,
      onClick: () => props.history.push("/movie_list/favorites"),
    },
    {
      label: "Search",
      icon: <SearchIcon />,
      onClick: () => props.history.push("/search"),
    },
    {
      label: "All Feedbacks",
      icon: <ListIcon />,
      onClick: () => props.history.push("/feedbacks"),
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{ height: "100%", position: "relative" }}>
      <div className={classes.userInfoContainer}>
        <div className={classes.userImage}>
          {user.name
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0])
            .join("")}
        </div>
        <div>{user.name}</div>
        <div>{user.username}</div>
      </div>
      <Divider />
      <List>
        {drawerElements.map((element, index) => (
          <div
            key={index}
            onClick={() => {
              element.onClick();
              if (matches) handleDrawerToggle();
            }}
          >
            <ListItem button key={element.label}>
              <ListItemIcon>{element.icon}</ListItemIcon>
              <ListItemText primary={element.label} />
            </ListItem>
          </div>
        ))}
      </List>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <Button onClick={() => logout()}>Logout</Button>
        </div>
        <img
          alt="tMDB Logo"
          style={{ maxHeight: "60px" }}
          src={config.tmdbCreditImageURL}
        ></img>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <h2>Movie App</h2>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

export default withRouter(Core);

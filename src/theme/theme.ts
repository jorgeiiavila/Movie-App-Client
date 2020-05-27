import { createMuiTheme } from "@material-ui/core";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#f50057",
      light: "#4f5b62",
      dark: "#000a12",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        backgroundColor: "#f50057",
      },
    },
  },
});

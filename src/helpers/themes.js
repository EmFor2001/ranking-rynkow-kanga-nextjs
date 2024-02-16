import { createTheme } from "@mui/material/styles";

export const theme = {
  palette: {
    background: "#fdfaf8",
    text: "#000",
    primary: "#E65321",
    secondary: "#c6e48b",
    accent: "#8bdb64",
  }
};

export const textFieldTheme = createTheme(
  {
    palette: {
      primary: {
        main: "#E65321",
      },
      secondary: {
        main: "#c6e48b",
      },
    },
  },
);
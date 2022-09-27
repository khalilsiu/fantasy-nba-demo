import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#999999'
    },
    warning: {
      main: '#DC3545'
    },
    info: {
      main: '#616161'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'white',
          color: 'black',
          textTransform: 'none',
          fontWeight: 'bold',
          ":hover": {
            background: 'white',
          }
        }
      }
    }
  }
});
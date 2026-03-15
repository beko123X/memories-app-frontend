import { createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

// 1️⃣ CREATE the theme (call the function)
export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    spacing: 5,
});
export default makeStyles((theme) => ({
  
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'rgba(0,183,255, 1)',
  },
  image: {
    marginLeft: '15px',
  },
  mainContainer: {
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  
}));
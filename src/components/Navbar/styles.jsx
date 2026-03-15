import { makeStyles } from '@mui/styles';
import { deepPurple } from '@mui/material/colors';

export default makeStyles((theme) => ({

  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    padding: '10px 50px',
    width: '100%',

    [theme.breakpoints.down("sm")]: {
      padding: '10px 20px',
    }
  },

  heading: {
    color: 'rgba(0,183,255, 1)',
    textDecoration: 'none',

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    }
  },

  image: {
    marginLeft: '10px',
    marginTop:'5px',

    [theme.breakpoints.down("sm")]: {
      height: '40px',
    }
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: "10px",
    }
  },

  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    }
  },

  userName: {
    display: 'flex',
    alignItems: 'center',

    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
    }
  },

  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },

}));
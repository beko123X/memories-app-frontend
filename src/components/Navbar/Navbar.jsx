import React, { useEffect } from 'react'
import memoriesLogo from "../../images/memories-Logo.png";
import memoriesText from "../../images/memories-Text.png";

import { AppBar, Avatar, Button, Toolbar, Typography} from '@mui/material';
import makeStyles from "./styles";
import {Link, useNavigate, useLocation} from "react-router-dom"
import { useDispatch } from 'react-redux';
import  {logout}  from '../../Redux/slices/AuthSlice';
import { jwtDecode } from "jwt-decode";

import { useSelector } from "react-redux";


const Navbar = () => 
{
    const classes = makeStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.authData);
    const location = useLocation();
    useEffect(() => {
  const token = user?.token;

  if (!token) return;

  try {
    // نتأكد أنه JWT حقيقي (3 أجزاء)
    if (token.split(".").length !== 3) return;

    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(logout());
      navigate("/auth");
    }
  } catch (error) {
    console.log("Token decode error:", error);
  }

}, [location, user]);
    const userLogout = ()=>
    {
        dispatch(logout())
        navigate("/auth");
    }

    return (
    <AppBar className={classes.appBar} position="static" color="inherit" >
        <Toolbar className={classes.toolbar} style={{ zIndex: 9999 }}>
            <Link to={'/'} className={classes.brandContainer}>
                
                <img className={classes.image} src={memoriesText} height="45px" alt="memories" />

                <img className={classes.image} src={memoriesLogo} height="40px" alt="memories" />
            </Link>

            {/* check if the user exist {logged In}  */}
            {user?.result ?
            (<div>
                <div className={classes.profile}>
                    <Avatar
                        className={classes.purple}
                        alt={user?.result?.name}
                        src={user?.result?.picture}
                        >{user?.result?.name?.charAt(0)}
                    </Avatar>
                    <Typography
                        variant='h6'
                        className={classes.userName}>
                            {user?.result?.name}
                    </Typography>
                    <Button variant='contained' color='secondary' className={classes.logout} onClick={userLogout}>Logout</Button>
                </div>
            </div>) : (
                <Button component={Link} to="/auth" color='primary' variant='contained'>Sign in</Button>
            )}
        </Toolbar>        
        

    </AppBar>
  )
}

export default Navbar
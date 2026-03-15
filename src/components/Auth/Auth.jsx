import React, { useState, useEffect } from 'react';
import { Avatar, Button, Container, Grid, Paper, Typography, Alert, Collapse } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'; // أضفنا useSelector
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { auth, signin, signup } from '../../Redux/slices/AuthSlice';
import Input from "./Input";
import makeStyles from "./styles";

// قواعد التحقق (Validation Schemas)
const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain one lowercase letter')
    .matches(/[A-Z]/, 'Must contain one uppercase letter')
    .matches(/[0-9]/, 'Must contain one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords don't match")
    .required('Confirm password is required'),
});

const signInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = makeStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // جلب الأخطاء القادمة من السيرفر عبر Redux
  const serverError = useSelector((state) => state.auth.error);

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  // دالة التحقق أثناء الكتابة
  const validateField = async (name, value) => {
    try {
      const schema = isSignUp ? signUpSchema : signInSchema;
      await Yup.reach(schema, name).validate(value);
      
      setErrors((prev) => {
        const newErrors = { ...prev, [name]: null };
        const hasErrors = Object.values(newErrors).some((err) => err !== null);
        if (!hasErrors && !serverError) setShowAlert(false);
        return newErrors;
      });
    } catch (yupError) {
      setErrors((prev) => ({ ...prev, [name]: yupError.message }));
      setShowAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schema = isSignUp ? signUpSchema : signInSchema;

    try {
      await schema.validate(formData, { abortEarly: false });
      setShowAlert(false);

      if (isSignUp) {
        dispatch(signup({ formData, navigate }));
      } else {
        dispatch(signin({ formData, navigate }));
      }
    } catch (yupError) {
      if (yupError.inner) {
        const validationErrors = {};
        yupError.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      setShowAlert(true);
    }
  };

  const switchMode = () => {
    setIsSignUp((prev) => !prev);
    setFormData(initialState);
    setErrors({});
    setShowAlert(false);
    setShowPassword(false);
    // تصفير خطأ السيرفر عند التبديل (اختياري حسب تصميم الـ Slice)
    dispatch({ type: 'auth/clearError' }); 
  };

  const googleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const result = {
        name: decoded.name, email: decoded.email,
        googleId: decoded.sub, imageUrl: decoded.picture,
      };
      const token = credentialResponse.credential;
      dispatch(auth({ result, token }));
      navigate("/");
    } catch (error) {
      console.log("Google Login Error:", error);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3} sx={{ p: 3, mt: 8 }}>
        
        {/* التنبيه يظهر في حالة خطأ Yup أو خطأ السيرفر (Email/Password mismatch) */}
        <Collapse in={showAlert || !!serverError}>
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {serverError ? serverError : "Please check the highlighted fields."}
          </Alert>
        </Collapse>

        <Avatar className={classes.avatar} sx={{ m: 'auto', bgcolor: 'secondary.main', mb: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5' align='center' gutterBottom>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half error={!!errors.firstName} helperText={errors.firstName} />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half error={!!errors.lastName} helperText={errors.lastName} />
              </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" error={!!errors.email} helperText={errors.email} />
            <Input 
                name="password" label="Password" handleChange={handleChange} 
                type={showPassword ? "text" : "password"} 
                handleShowPassword={handleShowPassword} 
                error={!!errors.password} helperText={errors.password} 
            />
            {isSignUp && (
                <Input 
                    name='confirmPassword' label='Repeat Password' 
                    type={showPassword ? "text" : "password"} 
                    handleChange={handleChange} 
                    handleShowPassword={handleShowPassword}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword} 
                />
            )}
          </Grid>

          <Button type="submit" fullWidth variant='contained' color='primary' sx={{ mt: 3, mb: 2 }}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <GoogleLogin onSuccess={googleSuccess} onError={() => console.log('Google Error')} />
          </div>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode} sx={{ fontSize: '0.8rem' }}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

const Input = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword, error, helperText }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      error={error}
      helperText={helperText}
      InputProps={(name === 'password' || name === 'confirmPassword') ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
    />
  </Grid>
);

export default Input;
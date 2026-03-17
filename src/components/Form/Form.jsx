import React, { useEffect, useState } from 'react';
import { Button, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import FileBase64 from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../Redux/slices/PostSlice';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import makeStyles from "./styles";

const postSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
  tags: Yup.string().required('Tags are required'),
  selectedFile: Yup.string().required('Please upload an image'),
});

const Form = ({ currentId, setCurrentId }) => {
  const classes = makeStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [loading, setLoading] = useState(false); // لحالة الرفع

  const postToEdit = useSelector((state) =>
    currentId ? state.posts.allPosts.find((p) => p._id === currentId) : null
  );

  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (postToEdit) setPostData({ ...postToEdit, tags: postToEdit.tags.join(',') });
  }, [postToEdit]);

  const validateField = async (name, value) => {
    try {
      await Yup.reach(postSchema, name).validate(value);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (yupError) {
      setErrors((prev) => ({ ...prev, [name]: yupError.message }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postSchema.validate(postData, { abortEarly: false });
      setLoading(true); // ابدأ التحميل

      const dataToSend = { 
        ...postData, 
        name: user?.result?.name, 
        tags: postData.tags.split(',').map(t => t.trim()) 
      };

      if (currentId) {
        await dispatch(updatePost({ id: currentId, updatedPost: dataToSend }));
      } else {
        await dispatch(createPost({ newPost: dataToSend, navigate }));
      }
      
      setLoading(false); // انتهى التحميل
      clearInput();
    } catch (yupError) {
      setLoading(false);
      if (yupError.inner) {
        const validationErrors = {};
        yupError.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const clearInput = () => {
    setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    setErrors({});
    if (setCurrentId) setCurrentId(null);
  };

  if (!user?.result?.name) return <Paper className={classes.paper}><Typography variant='h6' align='center'>Please Sign In to create your own memories.</Typography></Paper>;

  return (
    <Paper className={classes.paper} elevation={4} sx={{ p: 2 }}>
      <form autoComplete="off" noValidate className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" align="center" gutterBottom>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>

        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={handleInputChange} error={!!errors.title} helperText={errors.title} sx={{ mb: 2 }} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={handleInputChange} error={!!errors.message} helperText={errors.message} sx={{ mb: 2 }} />
        <TextField name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onChange={handleInputChange} error={!!errors.tags} helperText={errors.tags} sx={{ mb: 2 }} />

        <div className={classes.fileInput} style={{ marginBottom: '15px' }}>
          <FileBase64 type="file" multiple={false} onDone={({ base64 }) => {
                setPostData({ ...postData, selectedFile: base64 });
                validateField('selectedFile', base64);
            }} />
          {errors.selectedFile && <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>{errors.selectedFile}</Typography>}
        </div>

        <Button variant="contained" color="primary" size="large" type="submit" fullWidth sx={{ mb: 1 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={clearInput} fullWidth disabled={loading}>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
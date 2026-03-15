import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import makeStyles from "./styles";
import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
    const classes = makeStyles();
    const { allPosts, isLoading } = useSelector((store) => store.posts);

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress size={60} />
        </Box>
    );

    if (!allPosts.length) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Typography variant="h5">لا توجد ذكريات للعرض</Typography>
        </Box>
    );

    return (
        <Grid className={classes.container} container alignItems='stretch' spacing={3}>
            {allPosts.map((post) => (
                <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
                    <Post post={post} setCurrentId={setCurrentId} />
                </Grid>
            ))}
        </Grid>
    );
};
export default Posts;
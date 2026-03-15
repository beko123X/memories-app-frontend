import React, { useState } from 'react';
import { Button, ButtonBase, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import moment from "moment";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import makeStyles from "./styles";
import { deletePost, likePost } from '../../../Redux/slices/PostSlice';

const Post = ({ post, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const classes = makeStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Local state initialized with the post likes for instant feedback
  const [likes, setLikes] = useState(post?.likes || []); 
  
  const userId = user?.result?.googleId || user?.result?._id;
  const hasLikedPost = likes.find((like) => like === userId);

  const handleLike = async () => {
    // Dispatch the actual API call to Redux (Background)
    dispatch(likePost(post._id));

    // OPTIMISTIC UPDATE: Update local state immediately (Instant UI)
    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== userId)); // Remove like locally
    } else {
      setLikes([...likes, userId]); // Add like locally
    }
  };

  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  // Optimized Likes component reading from local 'likes' state
  const Likes = () => {
    if (likes.length > 0) {
      return hasLikedPost ? (
        <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
      ) : (
        <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
      );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  return (
    <Card className={classes.card} elevation={5}>
      <CardMedia 
        className={classes.media}
        image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
        title={post.title}
      />
      
      <div className={classes.overlay}>
        <Typography variant='h6'>{post.name}</Typography>
        <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
      </div>

      {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
        <div className={classes.overlay2}>
          <Button 
            style={{ color: 'white' }} 
            size='small' 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
          >
            <MoreHoriz fontSize='medium' /> 
          </Button>
        </div>
      )}

      <ButtonBase onClick={openPost} component="span" className={classes.cardActions} sx={{ display: 'block', textAlign: 'initial' }}>
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography variant='h5' className={classes.title} gutterBottom>{post.title}</Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>{post.message}</Typography>
        </CardContent>
      </ButtonBase>

      <CardActions className={classes.cardActions}>
        {/* Updated onClick to use handleLike for the instant state update */}
        <Button size='small' color='primary' disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>

        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <Button size='small' color='secondary' onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
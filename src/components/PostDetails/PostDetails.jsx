import React, { useEffect } from 'react'
import makeStyles from "./styles";
import { CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../Redux/slices/PostSlice';
import CommentSection from './CommentSection';


const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const classes = makeStyles();
  const dispatch = useDispatch();
  const { post, allPosts, isLoading } = useSelector((store) => store.posts);

  // 1. التمرير للأعلى وجلب بيانات المنشور (فقط عند تغيير الـ ID)
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPost(id));
  }, [id, dispatch]);

  // 2. جلب المنشورات المقترحة (فقط عندما يتغير الـ ID للمنشور الحالي)
  // لا نضع [post] كاملة هنا، بل نستخدم id المنشور فقط
  useEffect(() => {
    if (post?._id === id) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [id, post?._id, dispatch]); // ✅ نراقب الـ ID فقط وليس كائن الـ post بالكامل

  // 3. ترتيب منطق العرض (Render Logic)
  // يجب أن يكون شرط الـ Loading قبل محاولة الوصول لبيانات post
  if (isLoading) {
    return (
      <Paper className={classes.loadingPaper} elevation={6}>
        <CircularProgress size={'7em'} />
      </Paper>
    );
  }

  if (!post) return null;

  const recommendedPosts = allPosts.filter(({ _id }) => _id !== post._id);
  const openPost = (_id) => navigate(`/posts/${_id}`);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />

          {/* نمرر المنشور لمكون التعليقات */}
          <CommentSection post={post} />

          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img 
            className={classes.media} 
            src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} 
            alt={post.title} 
          />
        </div>
      </div>


{recommendedPosts.length > 0 && (
  <div className={classes.section}>
    <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
      You might also like:
    </Typography>
    <Divider />
    
    {/* الحاوية الأساسية بنظام Flex */}
    <div className={classes.recommendedContainer}>
      {recommendedPosts.map(({ title, name, message, selectedFile, _id }) => (
        <div 
          className={classes.recommendedCard} 
          onClick={() => openPost(_id)} 
          key={_id}
        >
          <img 
            src={selectedFile || 'https://via.placeholder.com/200'} 
            className={classes.recImage} 
            alt={title} 
          />
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">{name}</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {message.length > 50 ? `${message.substring(0, 50)}...` : message}
          </Typography>
        </div>
      ))}
    </div>
  </div>
)}
    </Paper>
  );
}


export default PostDetails
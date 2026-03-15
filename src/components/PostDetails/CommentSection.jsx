import React, {useRef, useState } from 'react'
import makeStyles from "./styles"
import { Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { commentPost } from '../../Redux/slices/PostSlice';
const CommentSection = ({post}) => {
    console.log(post);
    const classes = makeStyles();
    const user = JSON.parse(localStorage.getItem('profile'));//populate user from the localStorage
    const [comments, setComments] = useState(post?.comments);
    const dispatch = useDispatch();
    const [comment, setComment] = useState("");
    const commentsRef = useRef();
    const handleClick = async () => {
    const newCommentString = `${user?.result?.name}: ${comment}`;
    const oldComments = [...comments]; // حفظ النسخة القديمة في حال الفشل
    
    setComments([...comments, newCommentString]);
    setComment('');

    try {
        if (post?._id) {
            const actionResult = await dispatch(commentPost({ value: newCommentString, id: post._id }));
            
            if (commentPost.rejected.match(actionResult)) {
                 throw new Error("Failed to post comment");
            }

            const newPostData = actionResult.payload;
            setComments(newPostData.comments);

            setTimeout(() => {
                commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    } catch (error) {
        // في حال الفشل، نعيد التعليقات لما كانت عليه وننبه المستخدم
        setComments(oldComments);
        alert("Sorry, something went wrong. Please try again.");
    }
};
  return (
    <div>
        <div className={classes.commentsOuterContainer}>
            <div className={classes.commentsInnerContainer}>
                <Typography gutterBottom variant='h6'>Comments</Typography>
                {
                    comments.map((c, i) => (
                        <Typography key={i} variant='subtitle1' gutterBottom> 
                            <strong>{c.split(':')[0]}</strong>
                            {c.split(':')[1]}
                        </Typography>
                    ))
                    
                
                }
                {/* 5. The "Anchor" - the scroll will move to this empty div */}
                    <div ref={commentsRef} />
            </div>

            {user?.result?.name && (
                <div style={{width:'70%'}}>
                    <Typography gutterBottom variant='h6'>
                        Write a Comment
                    </Typography>
                    <TextField
                        fullWidth
                        rows={4}
                        variant='outlined'
                        label="Comment"
                        multiline
                        value={comment}
                        onChange={(e)=> setComment(e.target.value)}
                    />
                    <Button
                        style={{ marginTop:'10px'} }
                        fullWidth
                        disabled={!comment}
                        variant='contained'
                        onClick={handleClick}
                        color='primary'
                    >
                        Comment
                    </Button>
                </div>
            )}
        </div>
    </div>
  )
}

export default CommentSection
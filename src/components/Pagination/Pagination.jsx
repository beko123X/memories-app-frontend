import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import makeStyles from "./styles";

const Paginate = ({ page }) => {
    const { numberOfPages } = useSelector((state) => state.posts);
    const classes = makeStyles();

    return (
        <Pagination
            classes={{ ul: classes.ul }}
            count={numberOfPages}
            page={Number(page) || 1}
            variant='outlined'
            color='primary'
            renderItem={(item) => (
                <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
            )}
        />
    );
};

export default Paginate;
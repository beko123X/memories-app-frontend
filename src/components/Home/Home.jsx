import { AppBar, Autocomplete, Button, Chip, Container, Grid, Grow, Paper, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Paginate from '../Pagination/Pagination';
import makeStyles from "./styles";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../Redux/slices/PostSlice';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // قراءة المعاملات من الرابط (URL)
    const query = new URLSearchParams(location.search);
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const tagsQuery = query.get('tags');
    
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([]); // الحالة الافتراضية مصفوفة فارغة دائماً
    
    const classes = makeStyles();

    useEffect(() => {
        // إذا كان هناك بحث في الرابط، ابحث، وإلا اجلب البوستات بالصفحات
        if (searchQuery || tagsQuery) {
            dispatch(getPostsBySearch({ 
                search: searchQuery || 'none', 
                tags: tagsQuery || 'none', 
                page 
            }));
        } else {
            dispatch(getPosts(page));
        }
    }, [location, dispatch]);

    const searchPost = () => {
        const s = search.trim() ? search : 'none';
        const t = tags.length > 0 ? tags.join(',') : 'none';

        if (search.trim() || tags.length > 0) {
            navigate(`/posts/search?searchQuery=${s}&tags=${t}&page=1`);
        } else {
            navigate('/');
        }
    };

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container spacing={3} justifyContent="space-between" mt={1} alignItems="stretch" className={classes.gridContainer}>
                    <Grid item xs={12} sm={6} md={9} order={{ xs: 2, sm: 1 }}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} order={{ xs: 1, sm: 2 }}>
                        
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                            <TextField 
                                name='search' 
                                variant='outlined' 
                                label='Search Memories' 
                                fullWidth 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                style={{ marginBottom: '10px' }}
                            />

                            <Autocomplete
                                multiple
                                id="tags-filled"
                                options={[]} // لا تتركها فارغة، استخدم مصفوفة دائماً
                                freeSolo
                                value={tags || []} // ضمان عدم الانهيار
                                onChange={(event, newValue) => {
                                    setTags(newValue || []); // ضمان عدم التحديث بقيمة null
                                }}
                                renderTags={(value, getTagProps) =>
                                    (value || []).map((option, index) => (
                                        <Chip 
                                            key={index} 
                                            variant="outlined" 
                                            label={option} 
                                            {...getTagProps({ index })} 
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Search Tags" placeholder="Type & Enter" />
                                )}
                            />
                            <Button onClick={searchPost} color='primary' variant='contained' style={{ margin: "10px 0" }}>Search</Button>
                        </AppBar>

                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        
                        {/* إخفاء الترقيم في حالة البحث لضمان عدم حدوث تعارض */}
                        {!searchQuery &&  (
                            <Paper elevation={6} className={classes.pagination}>
                                <Paginate page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
};

export default Home;
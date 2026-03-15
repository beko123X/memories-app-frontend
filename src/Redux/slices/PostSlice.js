import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../api/api";
import { CREATEPOST, GETPOST, DELETEPOST, GETPOSTBYSEARCH, GETPOSTS, LIKEPOST, UPDATEPOST, COMMENTPOST } from "../../constants/actionTypes";

// Ensure you are passing the ID correctly into the URL string
export const getPost = createAsyncThunk(GETPOST, async (id, { rejectWithValue }) => {
    try {
        // Double check your base URL. If using a proxy, it's just `/posts/${id}`
        const { data } = await API.get(`/posts/${id}`); 
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});


export const getPosts = createAsyncThunk(GETPOSTS, async (page) => {
    try {
        const { data } = await API.get(`/posts?page=${page}`);
        console.log(`✅ Posts fetched: ${data}`); // Should show the array
        return data; // 👈 Return the array directly, NOT data.data
    } catch (error) {
        console.error(`❌ Error fetching posts: ${error}`);
        throw error;
    }
});


// FIX: The first argument is now an object { newPost, navigate }
export const createPost = createAsyncThunk(
  CREATEPOST,
  async ({ newPost, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/posts', newPost);

      // ✅ NAVIGATE INSIDE THE SLICE FUNCTION
      // data should contain the newly created post with its _id
      if (data?._id) {
        navigate(`/posts/${data._id}`);
      }

      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);
export const updatePost = createAsyncThunk(UPDATEPOST, 
    async ({ id, updatedPost }, { rejectWithValue }) => {
        try {
            const { data } = await API.patch(`/posts/${id}`, updatedPost);
            console.log(`✅ Post updated:`, data);
            return data; // Return the updated post from server
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update post');
        }
    }
);


export const likePost = createAsyncThunk(
  LIKEPOST,
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/posts/${id}/likePost`);

      console.log("✅ Post liked:", data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to Like Post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(DELETEPOST, 
    async ( id , { rejectWithValue }) => {
        try {
             await API.delete(`/posts/${id}`);
            console.log(`✅ Post Deleted:`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to Delete post');
        }
    }
);

// FIX: Accept 'searchQuery' (which contains {search, tags}) as an argument
export const getPostsBySearch = createAsyncThunk(GETPOSTBYSEARCH, async ({search, page, tags}) => {
    try {
        // FIX: Destructure correctly and pass to URL
        const { data } = await API.get(`/posts/search?searchQuery=${search}&tags=${tags}&page=${page}`);
        return data; 
    } catch (error) {
        console.error(`❌Error fetching posts: ${error}`);
        throw error;
    }
});

export const commentPost = createAsyncThunk(
  COMMENTPOST,
  async ({ value, id }, { rejectWithValue }) => {
    try {
      // Check your browser console: is this undefined?
      console.log("Thunk sending ID:", id); 

      // Make sure you pass both to your API function
      const { data } = await API.post(`/posts/${id}/commentPost`, { value });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


// ... (أبقي الـ imports و الـ Thunks كما هي)

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: [],
        isLoading: false,
        currentPost: null, 
        numberOfPages: 1,
        isError: false,
        errorMessage: null,
        post: null
    },
    extraReducers: (builder) => {
        builder
            // --- جلب كل المنشورات ---
            .addCase(getPosts.pending, (state) => { state.isLoading = true; })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPosts = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.numberOfPages = action.payload.numberOfPages;
            })
            .addCase(getPosts.rejected, (state) => { state.isLoading = false; })

            // --- البحث ---
            .addCase(getPostsBySearch.pending, (state) => { state.isLoading = true; })
            .addCase(getPostsBySearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPosts = action.payload.data;
                state.numberOfPages = action.payload.numberOfPages;
            })

            // --- إنشاء منشور جديد ---
            .addCase(createPost.fulfilled, (state, action) => {
                state.allPosts = [...state.allPosts, action.payload];
            })

            // --- تحديث منشور ---
            .addCase(updatePost.fulfilled, (state, action) => {
                state.allPosts = state.allPosts.map(post => 
                    post._id === action.payload._id ? action.payload : post
                );
            })

            // --- حذف منشور ---
            .addCase(deletePost.fulfilled, (state, action) => {
                state.allPosts = state.allPosts.filter((post) => post._id !== action.payload);
            })

            // --- الإعجاب (Like) ---
            .addCase(likePost.fulfilled, (state, action) => {
                // تحديث في المصفوفة العامة
                state.allPosts = state.allPosts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
                // تحديث المنشور الحالي إذا كنا في صفحة التفاصيل
                if(state.post?._id === action.payload._id) {
                    state.post = action.payload;
                }
            })

            // --- جلب منشور معين (تفاصيل) ---
            .addCase(getPost.pending, (state) => {
                state.isLoading = true; // نحتاج التحميل هنا فقط عند فتح الصفحة لأول مرة
                state.isError = false;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload;
            })

            // ========================================
            // ✅ قسم التعليقات (إصلاح التحميل)
            // ========================================
            .addCase(commentPost.pending, (state) => {
                // ❌ لا نضع state.isLoading = true هنا أبداً
                state.isError = false;
            })
            .addCase(commentPost.fulfilled, (state, action) => {
                // 1. تحديث المصفوفة العامة
                state.allPosts = state.allPosts.map((post) => {
                    if (post._id === action.payload._id) return action.payload;
                    return post;
                });

                // 2. تحديث المنشور الحالي (هذا يضمن ظهور التعليق فوراً)
                state.post = action.payload;
                
                // 3. نضمن أن isLoading تبقى false
                state.isLoading = false; 
                console.log('✅ Comment synchronized');
            })
            .addCase(commentPost.rejected, (state, action) => {
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export default postSlice.reducer;


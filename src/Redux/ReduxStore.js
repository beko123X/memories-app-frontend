import { configureStore } from "@reduxjs/toolkit";
import PostReducer from "./slices/PostSlice";
import AuthReducer from "./slices/AuthSlice";

// Configure Store
 export const myStore = configureStore({
    reducer: {
      posts:PostReducer,
      auth:AuthReducer
    },

    // MIDDLEWARE CONFIGURATION (explained simply)
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
         // IGNORE THESE CASES (for non-serializable data like Files)
         ignoredActions: [
          'posts/setSelectedFile',     // When we set a File object
          'posts/createPost/fulfilled' // When post has image data
        ],
        // IGNORE THESE PATHS in state
        ignoredPaths: [
          'posts.selectedFile',        // Where we store File objects
          'posts.items.image'          // If posts have image data
        ],
      },
    }),
    
  // DevTools is automatically enabled
  // Thunk middleware is automatically included

 });



// Store (post, order, blog)=> Plural Responsibility
// Each Data has it's slice
// Each Slice Has It's own reducer{counter slice, posts slice}
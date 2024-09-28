import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    posts: []
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers:{
        getPost:(state, action)=>{
            
            state.posts = action.payload
        },
        removePost: (state, action) => {
            // Remove the post with the matching ID
            state.posts = state.posts.filter(post => post.$id !== action.payload);
        },
        clearPosts:(state)=>{
            state.posts = []
        }
    }
})

export const {getPost, removePost, clearPosts} = postSlice.actions

export default postSlice.reducer
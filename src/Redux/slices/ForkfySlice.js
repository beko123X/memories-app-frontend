import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
// for handling reducer to call api and return state with 3 cases{rejected, pending, fulifulied}
export const getPizza = createAsyncThunk('forkify/getPizza', async ()=>
{
    const {data} = await axios.get('https://forkify-api.jonas.io/api/v2/recipes?search=pizza')
    return data
});

const ForkifySlice = createSlice
({
    name: 'forkify',
    initialState: {
        allPizza: null,
        allBeef: null,
        isLoading:false,
        isPending:false,
        isFulfilled:false,
        isError:false
    },

    extraReducers: (builder)=>
    {
        builder.addCase(getPizza.pending, (prevState)=>{
            prevState.isLoading= true;
            prevState.isError=false;
        });

        builder.addCase(getPizza.rejected , (prevState)=>{
            prevState.isLoading= false;
            prevState.isError= true;
        });

        builder.addCase(getPizza.fulfilled, (prevState, action)=>{
            prevState.isLoading= false;
            prevState.isError = false;
            prevState.allPizza = action.payload.data.recipes
            
        });

    }

});

export default ForkifySlice.reducer;
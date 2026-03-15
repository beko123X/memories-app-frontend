import { createSlice } from "@reduxjs/toolkit";


const CounterSlice =  createSlice({
    name: "counter",
    initialState: 
    {
        counter: 5,
        color: null
    },
    reducers:
    {
        // any reducer function may take two parameters (previous state , action)
        // any reducer function must be pure function
        increaseCounter: (prevState, action)=>
            {
                prevState.counter += action.payload
                console.log(action);
                console.log(action.payload);
                
                
            },

        decreaseCounter: (prevState, action)=>
            {
                prevState.counter -= action.payload
            }
        
        
    }
    
})

// actions=> object has all reducer functions of the slice
export const {increaseCounter, decreaseCounter} = CounterSlice.actions;

export default CounterSlice.reducer;
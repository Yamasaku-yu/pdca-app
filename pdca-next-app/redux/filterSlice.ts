import { createSlice } from "@reduxjs/toolkit";
export interface FilterState {
    category:string;
    period:string;
    keyword:string;
}

const initialState:FilterState = {
    category:"すべて",
    period:"すべて",
    keyword:"",
};

const filterSlice = createSlice({
    name:"filter",
    initialState,
    reducers:{
        setCategory(state,action){
            state.category = action.payload;
        },
        setPeriod(state,action){
            state.period = action.payload;
        },
        setKeyword(state,action){
            state.keyword = action.payload;
        },
        resetFilter(state) {
            return initialState;
        },
    },
});

export const {setCategory,setPeriod,setKeyword,resetFilter} = filterSlice.actions;
export default filterSlice.reducer;
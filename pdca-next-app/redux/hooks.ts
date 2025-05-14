import { TypedUseSelectorHook,useDispatch,useSelector } from "react-redux";
import type { RootState,AppDispatch } from "./store";
import { use } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
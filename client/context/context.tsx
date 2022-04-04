import Axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import {
  ActionI,
  InitialStateI,
  LoginI,
  LogoutI,
  PropsI,
  TypeE,
  UserI,
} from "../util/type";

const initialState: InitialStateI = {
  user: null,
  log: false,
};

const AppContext = React.createContext<{
  state: InitialStateI;
  dispatch: React.Dispatch<ActionI>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (state: InitialStateI, action: ActionI) => {
  switch (action.type) {
    case TypeE.LOGIN:
      return { ...state, user: action.payload, log: true };

    case TypeE.LOGOUT:
      return { ...state, user: null, log: false };
    default:
      throw new Error("unknow action");
  }
};

export const AppProvider = ({ children }: PropsI) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    Axios.get("/user")
      .then((res) => {
        dispatch(login(res.data.user));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobleContext = () => useContext(AppContext);

export const login = (userData: UserI): LoginI => ({
  type: TypeE.LOGIN,
  payload: userData,
});

export const logout = (): LogoutI => ({
  type: TypeE.LOGOUT,
});

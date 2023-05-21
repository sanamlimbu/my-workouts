import { User } from "firebase/auth";
import { createContext, useEffect, useReducer } from "react";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserInLocalStorage,
} from "../utils/auth";
import AuthReducer, { IAuthAction } from "./AuthReducer";

interface IAuthContext {
  currentUser: User | null;
  dispatch: React.Dispatch<IAuthAction>;
}

const INITIAL_STATE: IAuthContext = {
  currentUser: getUserFromLocalStorage(),
  dispatch: () => {},
};

const AuthContext = createContext<IAuthContext>(INITIAL_STATE);

const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.currentUser === null) {
      removeUserFromLocalStorage();
    } else {
      saveUserInLocalStorage(state.currentUser);
    }
  }, [state.currentUser]);
  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

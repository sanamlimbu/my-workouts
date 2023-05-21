import { User } from "firebase/auth";
import { Reducer } from "react";

interface IAuthState {
  currentUser: User | null;
}

export interface IAuthAction {
  type: string;
  payload?: User;
}

const AuthReducer: Reducer<IAuthState, IAuthAction> = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        currentUser: action.payload,
      } as IAuthState;
    }
    case "LOGOUT": {
      return {
        currentUser: null,
      } as IAuthState;
    }
    default:
      return state;
  }
};

export default AuthReducer;

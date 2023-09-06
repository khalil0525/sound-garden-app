import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";
//context object
export const AuthContext = createContext();

//Reducer function
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_IS_READY":
      return {
        ...state,
        user: action.payload,
        authIsReady: true,
        refreshUserTriggered: false,
      };
    case "REFRESH_AUTH_INFORMATION":
      return { ...state, refreshUserTriggered: true };
    //if action type doesn't match any other state in our switch statement
    default:
      return state;
  }
};

//Custom context provider component.
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
    refreshUserTriggered: false,
  });
  const { user, refreshUserTriggered } = state;
  // This will check if a user is logged in after page refresh or when they first load the site
  useEffect(() => {
    const reloadUser = async () => {
      try {
        await projectAuth.currentUser.reload();

        dispatch({ type: "AUTH_IS_READY", payload: projectAuth.currentUser });
      } catch (err) {
        console.log(err);
      }
    };
    if (refreshUserTriggered) {
      reloadUser();
    }
  }, [refreshUserTriggered, user]);
  useEffect(() => {
    //This function (onAuthStateChanged) will return an "unsub" function after it is called
    //This is why we called unsub() in the function, this is considered
    //To be our "clean up function". This makes it so we don't run this
    //Code every time we render a new page, but only when we initially
    //Load the application and on refresh.
    //We give it empty dependency array so it only runs once.
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      //Cleanup function
      unsub();
    });
  }, []);

  // Output the AuthContext state everytime we get a change

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

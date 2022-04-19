import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

// Custom hook that allows us to access our context AuthContext.
// We use this so we don't import useConxext in every file we use the context
// It returns an object so we can use what we need from our AuthContext file.
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error("useAuthContext must be inside an AuthContextProvider");
  }
  //This is an object that holds our context (user, authIsReady)
  return context;
};

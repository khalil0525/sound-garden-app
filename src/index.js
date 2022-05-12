import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/AuthContext";
import { AudioPlayerContextProvider } from "./context/AudioPlayerContext";
import "./fonts/Inter/Inter-Medium.ttf";
import "./fonts/Inter/Inter-Regular.ttf";
import "./fonts/Inter/Inter-Bold.ttf";
import "./fonts/Inter/Inter-SemiBold.ttf";

ReactDOM.render(
  <React.StrictMode>
    {/* Custom context provider component */}
    <AudioPlayerContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AudioPlayerContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import RootShell from "./RootShell";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { meetingStateReducer } from "./store/meetingReducer";

export const store = createStore(meetingStateReducer);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <RootShell />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PlayerContextProvider } from "./contexts";
import App from "./App.tsx";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <PlayerContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </PlayerContextProvider>
  </React.StrictMode>
);

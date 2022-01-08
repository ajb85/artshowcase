import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import App from "./App";
import Providers from "./providers";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "./styles/global.scss";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((req) => {
  if (!req.headers.authorization) {
    req.headers.authorization = localStorage.getItem("token");
  }

  return req;
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

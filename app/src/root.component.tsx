import React from "react";
import ReactDOM from "react-dom/client";
import "./root.component.css";
import Layout from "./root.layout.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);

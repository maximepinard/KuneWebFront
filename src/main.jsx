import React from "react";
import ReactDOM from "react-dom/client";
import Context from "./global-context.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Context />
  </React.StrictMode>,
);

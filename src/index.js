import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from './Components/App'
import { AuthProvider } from "./auth";

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>
, document.getElementById("root"));

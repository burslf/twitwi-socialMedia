import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from './Components/App'
import { AuthProvider } from "./auth";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>);

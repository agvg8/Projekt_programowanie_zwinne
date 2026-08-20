import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

const token = localStorage.getItem("kc_token");
const refreshToken = localStorage.getItem("kc_refreshToken");

keycloak.init({
    token: token || undefined,
    refreshToken: refreshToken || undefined,
    onLoad: "check-sso",
    checkLoginIframe: false
}).then(() => {

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

});
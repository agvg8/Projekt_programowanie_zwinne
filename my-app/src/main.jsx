import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false
}).then(() => {

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App keycloak={keycloak} />
        </React.StrictMode>
    );

});
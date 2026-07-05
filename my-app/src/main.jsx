import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: false,
    pkceMethod: "S256",
}).then((authenticated) => {
    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App keycloak={keycloak} isKeycloakAuthenticated={authenticated} />
        </React.StrictMode>
    );
});

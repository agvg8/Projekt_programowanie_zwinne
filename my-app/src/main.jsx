import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

// Zmieniamy na check-sso i odbieramy parametr "authenticated"
keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: false
}).then((authenticated) => {

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            {/* Przekazujemy keycloak do App – nasz nowy kod w App.jsx zajmie się resztą! */}
            <App keycloak={keycloak} />
        </React.StrictMode>
    );

}).catch((err) => {
    console.error("Błąd inicjalizacji Keycloak:", err);
});
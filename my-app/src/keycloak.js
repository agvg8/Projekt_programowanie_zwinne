import Keycloak from "keycloak-js";

// If Keycloak runs on a non-default port (e.g. 8180), update the URL below.
// Use Vite env variable VITE_KEYCLOAK_PORT when available, otherwise default to 8180.
const KEYCLOAK_PORT = import.meta.env.VITE_KEYCLOAK_PORT || "8180";
const keycloak = new Keycloak({
    url: `http://localhost:${KEYCLOAK_PORT}`,
    realm: "programowanie-zwinne",
    clientId: "react-frontend"
});
// Helpful debug log to verify which Keycloak URL frontend will use at runtime
console.info("Keycloak URL:", `http://localhost:${KEYCLOAK_PORT}`);

export default keycloak;
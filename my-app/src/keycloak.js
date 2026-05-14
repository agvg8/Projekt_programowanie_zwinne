import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "programowanie-zwinne",
    clientId: "react-frontend"
});

export default keycloak;
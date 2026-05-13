import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/zadanie";

export async function fetchTasks() {
    const res = await fetch(BASE_URL, {
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    });
    const data = await res.json();
    console.log(data)
    return data.content;
}

export async function updateTaskPriorytet(id, status) {
    await fetch(
        `http://localhost:8081/api/zadanie/${id}/priorytet?priorytet=${status}`,
        { method: "PATCH",
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }}
    );
}
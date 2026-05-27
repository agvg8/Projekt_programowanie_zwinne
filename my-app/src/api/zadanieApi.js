import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/zadanie";

export async function fetchTasks() {
    const headers = {};
    if (keycloak?.token) headers.Authorization = `Bearer ${keycloak.token}`;
    const res = await fetch(BASE_URL, { headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API fetchTasks failed: ${res.status} ${res.statusText} ${text}`);
    }
    const data = await res.json();
    console.log("fetchTasks response:", data);
    return Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
}

export async function updateTaskPriorytet(id, status) {
    const headers = {};
    if (keycloak?.token) headers.Authorization = `Bearer ${keycloak.token}`;
    const res = await fetch(`http://localhost:8081/api/zadanie/${id}/priorytet?priorytet=${status}`, {
        method: "PATCH",
        headers
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API updateTaskPriorytet failed: ${res.status} ${res.statusText} ${text}`);
    }
}
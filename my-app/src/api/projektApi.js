import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/projekt";

export async function fetchProjects() {
    const headers = {};
    if (keycloak?.token) headers.Authorization = `Bearer ${keycloak.token}`;

    const res = await fetch(BASE_URL, { headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API fetchProjects failed: ${res.status} ${res.statusText} ${text}`);
    }

    let data;
    try {
        data = await res.json();
    } catch (err) {
        throw new Error("Invalid JSON in fetchProjects response: " + err.message);
    }

    console.log("fetchProjects response:", data);

    const items = Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
    return items.map((p) => ({
        id: p.projektId || p.id,
        nazwa: p.nazwa || p.name || "",
        opis: p.opis || p.description || "",
        data_oddania: p.data_oddania || p.deadline || null,
        data_utworzenia: p.data_utworzenia || p.createdAt || null,
        zadania: p.zadania || p.tasks || []
    }));
}

export async function fetchProjectTasks(projectId) {
    const res = await fetch(
        `${BASE_URL}/${projectId}/zadania`,
        {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        }
    );

    return res.json();
}
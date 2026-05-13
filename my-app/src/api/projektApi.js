import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/projekt";

export async function fetchProjects() {
    const res = await fetch(BASE_URL, {
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    });
    const data = await res.json();
    console.log(data)
    return data.content.map((p) => ({
        id: p.projektId,
        nazwa: p.nazwa,
        opis: p.opis,
        data_oddania: p.data_oddania,
        data_utworzenia: p.data_utworzenia,
        zadania: p.zadania || []
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
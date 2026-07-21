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
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        }
    );
}

export async function createTask(task) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });


    if (!response.ok) {
        throw new Error("Nie udało się dodać zadania");
    }

    return true;
}

export async function updateTask(zadanieId, task) {
    const response = await fetch(`${BASE_URL}/${zadanieId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error("Nie udało się zaktualizować zadania");
    }
}

export async function deleteTask(zadanieId) {
    const response = await fetch(
        `${BASE_URL}/${zadanieId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Nie udało się usunąć zadania");
    }
}
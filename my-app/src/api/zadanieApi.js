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

export async function createTask(task) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(task)
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create task");
    }
}

export async function assignUserToTask(taskId, userId) {
    const res = await fetch(`http://localhost:8081/api/zadanie/${taskId}/przypisz/uzytkownik/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    });
    if (!res.ok) {
        throw new Error("Failed to assign user to task");
    }
}

export async function removeUserFromTask(taskId) {
    const res = await fetch(`http://localhost:8081/api/zadanie/${taskId}/usun/uzytkownik`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    });
    if (!res.ok) {
        throw new Error("Failed to remove user from task");
    }
}


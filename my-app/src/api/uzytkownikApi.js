import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/uzytkownik";

const authHeaders = async () => {
    await keycloak.updateToken(30);
    return {
        Authorization: `Bearer ${keycloak.token}`
    };
};

export async function fetchUsers(page = 0, size = 100) {
    const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`, {
        headers: await authHeaders()
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    const data = await res.json();
    return {
        users: data.content,
        totalPages: data.totalPages
    };
}

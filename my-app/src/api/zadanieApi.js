const BASE_URL = "http://localhost:8081/api/zadanie";

export async function fetchTasks() {
    const res = await fetch(BASE_URL, {
        headers: {
            Authorization: "Basic " + btoa("user:password")
        }
    });
    const data = await res.json();
    console.log(data)
    return data.content;
}

export async function updateTaskStatus(id, status) {
    await fetch(
        `http://localhost:8081/api/zadanie/${id}/status?status=${status}`,
        { method: "PATCH",
            headers: {
                Authorization: "Basic " + btoa("user:password")
            }}
    );
}
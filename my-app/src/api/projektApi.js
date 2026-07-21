import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/projekt";

const authHeaders = () => ({
    Authorization: `Bearer ${keycloak.token}`
});

export async function fetchProjects(page = 0, size = 10, search = "") {
    const query = search ? `&nazwa=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${BASE_URL}?page=${page}&size=${size}${query}`, {
        headers: authHeaders()
    });
    const data = await res.json();
    // console.log(data)
    return {
        projects: data.content.map((p) => ({
            id: p.projektId,
            nazwa: p.nazwa,
            opis: p.opis,
            data_oddania: p.data_oddania,
            data_utworzenia: p.data_utworzenia,
            zadania: p.zadania || []
        })),
        totalPages: data.totalPages
    };
}

export async function fetchProjectTasks(projectId, page = 0, size = 10, search = "") {
    const query = search ? `&nazwa=${encodeURIComponent(search)}` : "";
    const res = await fetch(
        `${BASE_URL}/${projectId}/zadania?page=${page}&size=${size}${query}`,
        {
            headers: authHeaders()
        }
    );

    const data = await res.json();
    return {
        tasks: data.content,
        totalPages: data.totalPages
    }
}

export async function fetchProjectAttachments(projectId) {
    const res = await fetch(`${BASE_URL}/${projectId}/zalaczniki`, {
        headers: authHeaders()
    });
    return res.json();
}

export async function uploadProjectAttachment(projectId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/${projectId}/zalaczniki`, {
        method: "POST",
        headers: authHeaders(),
        body: formData
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    return res.json();
}

export async function downloadProjectAttachment(projectId, attachmentId) {
    const res = await fetch(`${BASE_URL}/${projectId}/zalaczniki/${attachmentId}`, {
        headers: authHeaders()
    });

    if (!res.ok) {
        throw new Error("Download failed");
    }

    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = /filename="(.+)"/.exec(disposition);
    const filename = match ? match[1] : `zalacznik-${attachmentId}`;

    return { blob, filename };
}

export async function updateProject(projectDto) {
    const res = await fetch(`${BASE_URL}/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(projectDto)
    });

    if (!res.ok) {
        throw new Error("Update failed");
    }
}

export async function getProjects() {
    const response = await fetch(BASE_URL, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error("Nie udało się pobrać projektów");
    }
    const data = await response.json();
    return data.content;
}


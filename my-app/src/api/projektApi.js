import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/projekt";

const authHeaders = async () => {
    await keycloak.updateToken(30);
    return {
        Authorization: `Bearer ${keycloak.token}`
    };
};


export async function fetchProjects(page = 0, size = 10, search = "") {

    const query = search
        ? `&nazwa=${encodeURIComponent(search)}`
        : "";

    const res = await fetch(
        `${BASE_URL}?page=${page}&size=${size}${query}`,
        {
            headers: await authHeaders()
        }
    );

    const data = await res.json();

    return {
        projects: data.content.map((p) => ({
            id: p.projektId,
            nazwa: p.nazwa,
            opis: p.opis,

            data_oddania:
                p.dataOddania ?? p.data_oddania,

            data_utworzenia:
                p.dataUtworzenia ?? p.data_utworzenia,

            zadania:
                p.zadania || [],

            uzytkownicy:
                p.uzytkownicy || []
        })),

        totalPages: data.totalPages
    };
}



export async function fetchProject(projectId) {

    const res = await fetch(
        `${BASE_URL}/${projectId}`,
        {
            headers: await authHeaders()
        }
    );


    if (!res.ok) {
        throw new Error(
            "Failed to fetch project details"
        );
    }


    const p = await res.json();


    return {

        id: p.projektId,

        nazwa: p.nazwa,

        opis: p.opis,


        data_oddania:
            p.dataOddania ?? p.data_oddania,


        data_utworzenia:
            p.dataUtworzenia ?? p.data_utworzenia,


        zadania:
            p.zadania || [],


        uzytkownicy:
            p.uzytkownicy || []

    };
}





export async function fetchProjectTasks(
    projectId,
    page = 0,
    size = 10,
    search = ""
) {

    const query = search
        ? `&nazwa=${encodeURIComponent(search)}`
        : "";


    const res = await fetch(
        `${BASE_URL}/${projectId}/zadania?page=${page}&size=${size}${query}`,
        {
            headers: await authHeaders()
        }
    );


    const data = await res.json();


    return {
        tasks: data.content,
        totalPages: data.totalPages
    };
}





export async function fetchProjectAttachments(projectId) {

    const res = await fetch(
        `${BASE_URL}/${projectId}/zalaczniki`,
        {
            headers: await authHeaders()
        }
    );

    return res.json();
}





export async function uploadProjectAttachment(projectId,file) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    const res = await fetch(
        `${BASE_URL}/${projectId}/zalaczniki`,
        {
            method:"POST",
            headers: await authHeaders(),
            body:formData
        }
    );


    if(!res.ok){
        throw new Error("Upload failed");
    }


    return res.json();
}





export async function downloadProjectAttachment(
    projectId,
    attachmentId
) {

    const res = await fetch(
        `${BASE_URL}/${projectId}/zalaczniki/${attachmentId}`,
        {
            headers: await authHeaders()
        }
    );


    if(!res.ok){
        throw new Error("Download failed");
    }


    const blob = await res.blob();


    const disposition =
        res.headers.get(
            "Content-Disposition"
        ) || "";


    const match =
        /filename="(.+)"/.exec(disposition);


    const filename =
        match
            ? match[1]
            : `zalacznik-${attachmentId}`;


    return {
        blob,
        filename
    };
}





export async function updateProject(projectDto) {

    const res = await fetch(
        `${BASE_URL}/update`,
        {
            method:"PATCH",

            headers: {
                "Content-Type":"application/json",
                ...await authHeaders()
            },

            body:
                JSON.stringify(projectDto)
        }
    );


    if(!res.ok){
        throw new Error(
            "Update failed"
        );
    }

}





export async function getProjects() {

    const response =
        await fetch(
            BASE_URL,
            {
                headers: await authHeaders()
            }
        );


    if(!response.ok){

        throw new Error(
            "Nie udało się pobrać projektów"
        );

    }


    const data =
        await response.json();


    return data.content;
}





export async function createProject(project) {

    const res = await fetch(
        BASE_URL,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                ...await authHeaders()
            },

            body:
                JSON.stringify(project)
        }
    );


    if(!res.ok){

        const errorText =
            await res.text();

        throw new Error(
            errorText ||
            "Nie udało się utworzyć projektu"
        );

    }

}





export async function deleteProject(projectId) {

    const res = await fetch(
        `${BASE_URL}/${projectId}`,
        {
            method:"DELETE",
            headers:await authHeaders()
        }
    );


    if(!res.ok){

        throw new Error(
            "Nie udało się usunąć projektu"
        );

    }

}





export async function assignUserToProject(
    projectId,
    userId
) {

    const res = await fetch(
        `${BASE_URL}/${projectId}/przypisz/uzytkownik/${userId}`,
        {
            method:"PATCH",
            headers:await authHeaders()
        }
    );


    if(!res.ok){

        throw new Error(
            "Failed to assign user to project"
        );

    }

}





export async function removeUserFromProject(
    projectId,
    userId
) {

    const res = await fetch(
        `${BASE_URL}/${projectId}/usun/uzytkownik/${userId}`,
        {
            method:"PATCH",
            headers:await authHeaders()
        }
    );


    if(!res.ok){

        throw new Error(
            "Failed to remove user from project"
        );

    }

}
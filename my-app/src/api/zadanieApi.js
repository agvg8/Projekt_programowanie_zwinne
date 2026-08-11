import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/zadanie";


const authHeaders = async () => {
    await keycloak.updateToken(30);
    return {
        Authorization: `Bearer ${keycloak.token}`
    };
};



export async function fetchTasks() {

    const res = await fetch(
        BASE_URL,
        {
            headers: await authHeaders()
        }
    );

    const data = await res.json();

    console.log(data);

    return data.content;
}





export async function updateTaskPriorytet(id, status) {

    const res = await fetch(
        `${BASE_URL}/${id}/priorytet?priorytet=${status}`,
        {
            method:"PATCH",
            headers: await authHeaders()
        }
    );


    if(!res.ok){
        throw new Error(
            "Nie udało się zmienić priorytetu zadania"
        );
    }

}





export async function createTask(task) {

    const res = await fetch(
        BASE_URL,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                ...await authHeaders()
            },

            body:
                JSON.stringify(task)
        }
    );


    if(!res.ok){

        const errorText =
            await res.text();

        throw new Error(
            errorText ||
            "Nie udało się dodać zadania"
        );

    }

}





export async function updateTask(
    zadanieId,
    task
) {

    const response =
        await fetch(
            `${BASE_URL}/${zadanieId}`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json",
                    ...await authHeaders()
                },

                body:
                    JSON.stringify(task)
            }
        );


    if(!response.ok){

        throw new Error(
            "Nie udało się zaktualizować zadania"
        );

    }

}





export async function deleteTask(
    zadanieId
) {

    const response =
        await fetch(
            `${BASE_URL}/${zadanieId}`,
            {
                method:"DELETE",
                headers: await authHeaders()
            }
        );


    if(!response.ok){

        throw new Error(
            "Nie udało się usunąć zadania"
        );

    }

}





export async function updateTaskStatus(
    id,
    status
) {

    const res =
        await fetch(
            `${BASE_URL}/${id}/status?status=${status}`,
            {
                method:"PATCH",
                headers: await authHeaders()
            }
        );


    if(!res.ok){

        throw new Error(
            "Failed to update task status"
        );

    }

}





export async function assignUserToTask(
    taskId,
    userId
) {

    const res =
        await fetch(
            `${BASE_URL}/${taskId}/przypisz/uzytkownik/${userId}`,
            {
                method:"PATCH",
                headers: await authHeaders()
            }
        );


    if(!res.ok){

        throw new Error(
            "Failed to assign user to task"
        );

    }

}





export async function removeUserFromTask(
    taskId
) {

    const res =
        await fetch(
            `${BASE_URL}/${taskId}/usun/uzytkownik`,
            {
                method:"PATCH",
                headers: await authHeaders()
            }
        );


    if(!res.ok){

        throw new Error(
            "Failed to remove user from task"
        );

    }

}
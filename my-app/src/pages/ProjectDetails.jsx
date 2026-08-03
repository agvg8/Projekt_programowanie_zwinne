import {useState, useMemo, useEffect} from "react";

import {
    updateTaskPriorytet,
    fetchTasks,
    assignUserToTask,
    removeUserFromTask,
    updateTaskStatus,
    deleteTask
} from "../api/zadanieApi";

import {
    fetchProjectTasks,
    updateProject,
    fetchProject,
    deleteProject
} from "../api/projektApi.js";

import {fetchUsers} from "../api/uzytkownikApi.js";

import {FaGoogle} from "react-icons/fa";

import AddTaskModal from "../components/AddTaskModal";


const mapStatusLabel = (status) => {

    switch(status){

        case "TODO":
            return "TODO";

        case "IN_PROGRESS":
            return "WIP";

        case "DONE":
            return "DONE";

        default:
            return status || "TODO";
    }

};



const getStatusBg = (status)=>{

    switch(status){

        case "TODO":
            return "#e2e8f0";

        case "IN_PROGRESS":
            return "#feebc8";

        case "DONE":
            return "#c6f6d5";

        default:
            return "#e2e8f0";

    }

};



const getStatusColor = (status)=>{

    switch(status){

        case "TODO":
            return "#4a5568";

        case "IN_PROGRESS":
            return "#c05621";

        case "DONE":
            return "#22543d";

        default:
            return "#4a5568";

    }

};




export default function ProjectDetails({

    project,

    onBack,

    setCurrentPage,

    setEditedTask,

    refreshProjects,

    setSelectedTask

}) {


    const [currentProject,setCurrentProject] =
        useState(project);



    const [tasks,setTasks] =
        useState([]);



    const [allUsers,setAllUsers] =
        useState([]);



    const [page,setPage] =
        useState(0);



    const [size,setSize] =
        useState(10);



    const [totalPages,setTotalPages] =
        useState(1);



    const [search,setSearch] =
        useState("");



    const [debouncedSearch,setDebouncedSearch] =
        useState("");



    const [isEditingDeadline,setIsEditingDeadline] =
        useState(false);



    const [tempDeadline,setTempDeadline] =
        useState("");



    const [isEditingProject,setIsEditingProject] =
        useState(false);



    const [editedName,setEditedName] =
        useState("");



    const [editedDescription,setEditedDescription] =
        useState("");



    const [isAddTaskModalOpen,setIsAddTaskModalOpen] =
        useState(false);






    useEffect(()=>{

        if(!project?.id)
            return;


        setIsEditingDeadline(false);



        fetchProject(project.id)

            .then(data=>{

                setCurrentProject(data);

            })

            .catch(err=>{

                console.error(
                    "Error fetching project:",
                    err
                );

            });



        fetchUsers()

            .then(data=>{

                setAllUsers(
                    data.users || []
                );

            })

            .catch(err=>{

                console.error(
                    "Error fetching users:",
                    err
                );

            });


    },[project]);







    const mapPriority=(priority)=>{

        switch(priority){

            case "LOW":
                return "low";

            case "MEDIUM":
                return "medium";

            case "HIGH":
                return "high";

            default:
                return "low";

        }

    };






    const sortTasksByStatus=(tasks)=>{

        const order={

            IN_PROGRESS:1,

            TODO:2,

            DONE:3

        };


        return [...tasks].sort(
            (a,b)=>
                order[a.status]-order[b.status]
        );

    };






    const refreshTasks=()=>{


        if(!currentProject?.id)
            return;



        fetchProjectTasks(

            currentProject.id,

            page,

            size,

            debouncedSearch

        )

        .then(data=>{


            const mappedTasks =
                data.tasks.map(z=>({


                    id:z.zadanieId,


                    text:z.nazwa,


                    opis:z.opis,


                    priority:z.priorytet,


                    status:z.status,


                    uiPriority:
                        mapPriority(
                            z.priorytet
                        ),



                    assignedUserId:

                        z.uzytkownik

                        ?

                        z.uzytkownik.uzytkownikId

                        :

                        "",



                    assignedUserName:

                        z.uzytkownik

                        ?

                        `${z.uzytkownik.imie} ${z.uzytkownik.nazwisko}`

                        :

                        "Brak",



                    original:z


                }));


            setTasks(
                sortTasksByStatus(mappedTasks)
            );


            setTotalPages(
                data.totalPages
            );


        })


        .catch(err=>{

            console.error(
                "Error fetching tasks:",
                err
            );

        });


    };






    useEffect(()=>{

        refreshTasks();

    },[
        currentProject?.id,
        page,
        size,
        debouncedSearch
    ]);







    useEffect(()=>{


        const timer =
            setTimeout(()=>{

                setDebouncedSearch(search);

                setPage(0);


            },300);



        return ()=>clearTimeout(timer);


    },[search]);






    const progress =
        useMemo(()=>{


            if(!tasks.length)
                return 0;



            const done =
                tasks.filter(
                    t=>t.status==="DONE"
                ).length;



            return Math.round(
                done /
                tasks.length *
                100
            );


        },[tasks]);






    const cycleStatus =
        async(taskId,currentStatus)=>{


            const next =

                currentStatus==="TODO"

                ?

                "IN_PROGRESS"

                :

                currentStatus==="IN_PROGRESS"

                ?

                "DONE"

                :

                "TODO";



            try{


                await updateTaskStatus(
                    taskId,
                    next
                );



                setTasks(prev=>

                    sortTasksByStatus(

                        prev.map(t=>

                            t.id===taskId

                            ?

                            {

                                ...t,

                                status:next,

                                original:{

                                    ...t.original,

                                    status:next

                                }

                            }

                            :

                            t

                        )

                    )

                );


            }

            catch(err){

                alert(
                    "Błąd zmiany statusu: "
                    +
                    err.message
                );

            }


        };






    const handleAssignUserToTask =
        async(taskId,userId)=>{


            try{


                if(userId){

                    await assignUserToTask(
                        taskId,
                        Number(userId)
                    );

                }

                else{

                    await removeUserFromTask(
                        taskId
                    );

                }


                refreshTasks();


            }

            catch(err){

                alert(
                    "Błąd przypisywania użytkownika: "
                    +
                    err.message
                );

            }


        };
      const handleDeleteProject = async () => {

        if(!window.confirm("Usunąć projekt?"))
            return;


        try {

            await deleteProject(
                currentProject.id
            );


            refreshProjects();

            onBack();


        } catch(err){

            alert(err.message);

        }

    };





    const handleStartEditProject = ()=>{

        setEditedName(
            currentProject.nazwa
        );

        setEditedDescription(
            currentProject.opis || ""
        );


        setIsEditingProject(true);

    };





    const handleSaveProject = async () => {
        try {
            await updateProject({

                projektId:
                    currentProject.id,

                nazwa:
                    editedName,

                opis:
                    editedDescription,

                dataOddania:
                    currentProject.data_oddania

            });



            setCurrentProject(prev=>({

                ...prev,

                nazwa:editedName,

                opis:editedDescription

            }));



            refreshProjects();


            setIsEditingProject(false);



            if(setSelectedTask){

                setSelectedTask(prev=>({

                    ...prev,

                    nazwa:editedName,

                    opis:editedDescription

                }));

            }



        }

        catch(err){

            alert(err.message);

        }


    };






    const handleEditTask=(task,e)=>{

        e.stopPropagation();


        setEditedTask(task);

        setCurrentPage("addTask");

    };






    const handleDeleteTask=async(taskId,e)=>{


        e.stopPropagation();



        if(!window.confirm("Usunąć zadanie?"))
            return;



        try{


            await deleteTask(taskId);



            setTasks(prev=>

                prev.filter(
                    t=>t.id!==taskId
                )

            );


        }

        catch(err){

            alert(err.message);

        }

    };






    const handleStartEditDeadline=()=>{


        const rawDate =
            currentProject.data_oddania;



        const formatted =

            rawDate

            ?

            rawDate.substring(0,16)

            :

            new Date()
                .toISOString()
                .substring(0,16);



        setTempDeadline(
            formatted
        );


        setIsEditingDeadline(true);

    };






    const handleSaveDeadline=async()=>{


        let formattedDeadline=null;



        if(tempDeadline){

            formattedDeadline =

                tempDeadline.length===16

                ?

                `${tempDeadline}:00`

                :

                tempDeadline;

        }
        try {
            await updateProject({

                projektId:
                    currentProject.id,

                nazwa:
                    currentProject.nazwa,

                opis:
                    currentProject.opis,

                dataOddania:
                    formattedDeadline

            });



            setCurrentProject(prev=>({

                ...prev,

                data_oddania:
                    formattedDeadline

            }));



            setIsEditingDeadline(false);



        }

        catch(err){

            alert(err.message);

        }


    };







    const getGoogleCalendarUrl=(proj)=>{


        if(!proj.data_oddania)
            return "#";



        try{


            const dateObj =
                new Date(
                    proj.data_oddania
                );



            if(
                isNaN(
                    dateObj.getTime()
                )
            )
                return "#";



            const endDate =
                new Date(
                    dateObj.getTime()
                );



            const startDate =
                new Date(
                    dateObj.getTime()
                    -
                    60*60*1000
                );



            const formatUTC=(d)=>

                d.toISOString()
                .replace(/[-:]/g,"")
                .split(".")[0]
                +"Z";



            const dates =

                `${formatUTC(startDate)}/${formatUTC(endDate)}`;



            const text =

                `Deadline: ${proj.nazwa}`;



            const details =

                `Opis projektu: ${proj.opis || "Brak opisu"}\n\nTermin oddania: ${proj.data_oddania}`;



            return (

                "https://calendar.google.com/calendar/render?action=TEMPLATE"
                +
                `&text=${encodeURIComponent(text)}`
                +
                `&dates=${dates}`
                +
                `&details=${encodeURIComponent(details)}`
                +
                "&sf=true&output=xml"

            );


        }

        catch(e){

            return "#";

        }

    };








    return (

<div className="project-details">


<div className="details-header">


<button
className="back-btn"
onClick={onBack}
>
← Back to dashboard
</button>



<button

className="delete-project-btn"

onClick={handleDeleteProject}

>
🗑 Usuń projekt
</button>


</div>





{
isEditingProject ?


<div className="edit-form">


<label>
Project name
</label>


<input

value={editedName}

onChange={
e=>setEditedName(e.target.value)
}

/>



<label>
Description
</label>


<textarea

value={editedDescription}

onChange={
e=>setEditedDescription(e.target.value)
}

/>



<div className="edit-buttons">


<button

className="save-btn"

onClick={handleSaveProject}

>
Zapisz
</button>



<button

className="cancel-project-btn"

onClick={()=>
setIsEditingProject(false)
}

>
Anuluj
</button>


</div>


</div>



:


<>


<div className="project-title-row">


<h1 className="details-title">

{currentProject.nazwa}

</h1>



<button

className="edit-project-btn"

onClick={handleStartEditProject}

>
✏️
</button>


</div>



<p className="project-desc">

{currentProject.opis}

</p>


</>

}








<div className="progress-wrapper">


<div className="progress-info">

<span>
Progress
</span>


<span>
{progress}%
</span>


</div>



<div className="progress-bar">

<div

className="progress-fill"

style={{
width:`${progress}%`
}}

/>

</div>


</div>







<div className="details-card">


<div className="details-row">

<span className="label">
Created:
</span>


<span>

{
currentProject.data_utworzenia

?

new Date(
currentProject.data_utworzenia
)
.toLocaleDateString("pl-PL")

:

"Brak"
}

</span>


</div>





<div className="details-row">


<span className="label">
Deadline:
</span>



{

isEditingDeadline


?


<div>


<input

type="datetime-local"

value={tempDeadline}

onChange={
e=>setTempDeadline(e.target.value)
}

/>


<button

onClick={handleSaveDeadline}

>
Zapisz
</button>


<button

onClick={()=>
setIsEditingDeadline(false)
}

>
Anuluj
</button>


</div>



:


<div>


<span>

{
currentProject.data_oddania

?

new Date(
currentProject.data_oddania
)
.toLocaleString("pl-PL")

:

"Brak"

}

</span>


<button

onClick={handleStartEditDeadline}

>
✏️
</button>


</div>


}


</div>




<div className="details-row">

<span className="label">
Tasks:
</span>


<span>
{tasks.length}
</span>


</div>





{
currentProject.data_oddania &&


<a

className="google-calendar-btn"

href={
getGoogleCalendarUrl(currentProject)
}

target="_blank"

rel="noopener noreferrer"

>

<FaGoogle/>

Dodaj do Kalendarza Google


</a>

}




</div>








<div className="subtasks-section">


<div className="tasks-header">


<h2>
Tasks
</h2>



<button

className="btn add-task"

onClick={()=>
setIsAddTaskModalOpen(true)
}

>

+ Nowe zadanie

</button>



<input

className="search-input"

placeholder="Search tasks..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>







<div className="subtasks-list">


{

tasks.map(task=>(


<div

key={task.id}

className={
`task-item ${task.uiPriority} ${task.status.toLowerCase()}`
}

onClick={()=>
cycleStatus(
task.id,
task.status
)
}

>




<div className="task-left">


<div className="task-title">

{task.text}

</div>



<div className="task-desc">

{task.opis || "No description"}

</div>


</div>







<div

className="task-user-assignment"

onClick={
e=>e.stopPropagation()
}

>


<label>
Przypisany:
</label>



<select

value={
task.assignedUserId || ""
}

onChange={
e=>
handleAssignUserToTask(
task.id,
e.target.value
)
}

>


<option value="">
Brak przypisania
</option>



{

allUsers.map(u=>(


<option

key={u.uzytkownikId}

value={u.uzytkownikId}

>

{u.imie} {u.nazwisko}

</option>


))

}


</select>



</div>







<div className="task-right">


<div

className="task-status-badge"

style={{

background:getStatusBg(task.status),

color:getStatusColor(task.status)

}}

>

{mapStatusLabel(task.status)}

</div>



<div className="task-priority">

Prio: {task.priority}

</div>




<button

className="task-action edit"

onClick={
e=>handleEditTask(
task.original,
e
)
}

>
✏️
</button>




<button

className="task-action delete"

onClick={
e=>handleDeleteTask(
task.id,
e
)
}

>
🗑️
</button>


</div>



</div>


))


}


</div>







<div className="pagination">


<button

disabled={page===0}

onClick={()=>
setPage(
p=>Math.max(0,p-1)
)
}

>
Poprzednia
</button>



<span>

Strona {page+1} z {totalPages}

</span>




<button

disabled={
page>=totalPages-1
}

onClick={()=>
setPage(
p=>Math.min(
totalPages-1,
p+1
)
)
}

>
Następna
</button>




<select

value={size}

onChange={
e=>{
setSize(
Number(e.target.value)
);

setPage(0);

}
}

>


<option value={5}>
5 na stronę
</option>


<option value={10}>
10 na stronę
</option>


<option value={20}>
20 na stronę
</option>


</select>


</div>





</div>







<AddTaskModal

isOpen={isAddTaskModalOpen}

onClose={()=>
setIsAddTaskModalOpen(false)
}

projectId={
currentProject.id
}

onTaskCreated={
refreshTasks
}

currentTaskCount={
tasks.length
}

/>




</div>

);

}


import {useEffect, useState} from "react";
import {getProjects} from "../../api/projektApi";
import {createTask, updateTask} from "../../api/zadanieApi";
import "./AddTask.css";


export default function AddTaskPage({
                                        task,
                                        setCurrentPage
                                    }) {
    const [projects, setProjects] = useState([]);

    const [form, setForm] = useState({
        nazwa: "",
        opis: "",
        projektId: "",
        priorytet: "MEDIUM",
        status: "TODO"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const isEdit = task != null;


    useEffect(() => {
        loadProjects();
    }, []);
    useEffect(() => {

        if (!task) return;

        setForm({
            nazwa: task.nazwa,
            opis: task.opis ?? "",
            projektId: task.projekt.projektId,
            priorytet: task.priorytet,
            status: task.status
        });

    }, [task]);


    async function loadProjects() {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError("Nie udało się pobrać projektów");
        }
    }


    function handleChange(e) {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }


    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setError("");


        if (!form.projektId) {
            setError("Projekt jest wymagany");
            return;
        }


        const taskData = {
            nazwa: form.nazwa,
            opis: form.opis,

            // pole wymagane przez backend,
            // mimo że nieużywane
            kolejnosc: 0,

            dataczasDodania: new Date()
                .toISOString()
                .slice(0, 19),

            priorytet: form.priorytet,

            status: form.status,

            projekt: {
                projektId: Number(form.projektId)
            }
        };


        try {

            if (isEdit) {

                await updateTask(task.zadanieId, taskData);

                setMessage("Zadanie zaktualizowane");

                // opcjonalnie powrót
                setCurrentPage("details");

            } else {

                await createTask(taskData);

                setMessage("Dodano zadanie");

                setForm({
                    nazwa: "",
                    opis: "",
                    projektId: "",
                    priorytet: "MEDIUM",
                    status: "TODO"
                });

            }

        } catch (err) {
            setError(err.message);
        }
    }


    return (
        <div className="add-task-page">

            <h1 className="title">
                {isEdit ? "Edytuj zadanie" : "Dodaj zadanie"}
            </h1>

            <div className="add-task-card">

                <form
                    className="add-task-form"
                    onSubmit={handleSubmit}
                >


                    <label>
                        Nazwa
                    </label>

                    <input
                        type="text"
                        name="nazwa"
                        value={form.nazwa}
                        onChange={handleChange}
                        required
                        maxLength="50"
                    />


                    <label>
                        Opis
                    </label>

                    <textarea
                        name="opis"
                        value={form.opis}
                        onChange={handleChange}
                        maxLength="1000"
                    />


                    <label>
                        Projekt
                    </label>

                    <select
                        name="projektId"
                        value={form.projektId}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            -- wybierz projekt --
                        </option>


                        {projects.map(project => (

                            <option
                                key={project.projektId}
                                value={project.projektId}
                            >
                                {project.nazwa}
                            </option>

                        ))}

                    </select>


                    <label>
                        Priorytet
                    </label>

                    <select
                        name="priorytet"
                        value={form.priorytet}
                        onChange={handleChange}
                    >

                        <option value="HIGH">
                            HIGH
                        </option>

                        <option value="MEDIUM">
                            MEDIUM
                        </option>

                        <option value="LOW">
                            LOW
                        </option>

                    </select>


                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >

                        <option value="TODO">
                            TODO
                        </option>

                        <option value="IN_PROGRESS">
                            IN_PROGRESS
                        </option>

                        <option value="DONE">
                            DONE
                        </option>

                    </select>


                    <button
                        className="save-btn"
                        type="submit"
                    >
                        {isEdit ? "Zapisz zmiany" : "Dodaj zadanie"}
                    </button>


                    {
                        message &&
                        <div className="success-message">
                            {message}
                        </div>
                    }


                    {
                        error &&
                        <div className="error-message">
                            {error}
                        </div>
                    }


                </form>

            </div>

        </div>
    );
}

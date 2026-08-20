import {useState} from "react";
import {createProject} from "../../api/projektApi.js";
import "./addProject.css";

export default function AddProject({
                                       setCurrentPage,
                                       refreshProjects
                                   }) {
    const [nazwa, setNazwa] = useState("");
    const [opis, setOpis] = useState("");
    const [error, setError] = useState("");
    const [deadlineDate, setDeadlineDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const [deadlineTime, setDeadlineTime] = useState("23:59");
    const getDefaultDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        return now.toISOString().slice(0, 16);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nazwa.trim()) {
            setError("Nazwa projektu jest wymagana");
            return;
        }
        const project = {
            nazwa: nazwa.trim(),
            opis: opis.trim(),
            dataOddania: `${deadlineDate}T${deadlineTime}:00`
        };
        try {
            await createProject(project);
            refreshProjects();
            alert("Dodano projekt");
            setCurrentPage("dashboard");
        } catch (err) {
            setError(
                err.message || "Nie udało się dodać projektu"
            );
        }
    };


    return (
        <div className="add-project-page">

            <h1 className="add-project-title">
                Create project
            </h1>

            <div className="add-project-card">

                <form
                    className="add-project-form"
                    onSubmit={handleSubmit}
                >

                    <div>

                        <label>
                            Project name
                        </label>

                        <input
                            type="text"
                            value={nazwa}
                            onChange={(e) => setNazwa(e.target.value)}
                            maxLength={50}
                        />

                    </div>

                    <div>

                        <label>
                            Description
                        </label>

                        <textarea
                            value={opis}
                            onChange={(e) => setOpis(e.target.value)}
                            maxLength={1000}
                        />

                    </div>

                    <div className="form-group">
                        <label>Deadline</label>

                        <div className="deadline-group">
                            <input
                                type="date"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                            />

                            <input
                                type="time"
                                value={deadlineTime}
                                onChange={(e) => setDeadlineTime(e.target.value)}
                            />
                        </div>
                    </div>
                    {error &&
                        <div className="project-error">
                            {error}
                        </div>
                    }

                    <div className="add-project-buttons">

                        <button
                            className="save-btn"
                            type="submit"
                        >
                            Create project
                        </button>

                        <button
                            type="button"
                            className="cancel-project-btn"
                            onClick={() => setCurrentPage("dashboard")}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
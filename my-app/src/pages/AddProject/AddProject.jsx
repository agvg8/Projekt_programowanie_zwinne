import { useState } from "react";
import { createProject } from "../../api/projektApi.js";

export default function AddProject({
                                       setCurrentPage,
                                       refreshProjects
                                   }) {
    const [nazwa, setNazwa] = useState("");
    const [opis, setOpis] = useState("");
    const [error, setError] = useState("");

    const getDefaultDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        return now.toISOString().slice(0, 16);
    };

    const [dataOddania, setDataOddania] = useState(getDefaultDateTime());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nazwa.trim()) {
            setError("Nazwa projektu jest wymagana");
            return;
        }
        const project = {
            nazwa: nazwa.trim(),
            opis: opis.trim(),
            dataOddania: dataOddania + ":00"
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
        <div className="project-form-page">
            <h1>
                Add new project
            </h1>
            <form
                className="project-form"
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>
                        Project name
                    </label>
                    <input
                        type="text"
                        value={nazwa}
                        onChange={(e) =>
                            setNazwa(e.target.value)
                        }
                        placeholder="Project name"
                        maxLength={50}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Description
                    </label>
                    <textarea
                        value={opis}
                        onChange={(e) =>
                            setOpis(e.target.value)
                        }
                        placeholder="Project description"
                        maxLength={1000}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Deadline
                    </label>

                    <input
                        type="datetime-local"
                        value={dataOddania}
                        onChange={(e) =>
                            setDataOddania(e.target.value)
                        }
                    />
                </div>
                {
                    error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )
                }
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn save-btn"
                    >
                        Create project
                    </button>
                    <button
                        type="button"
                        className="btn cancel-btn"
                        onClick={() => setCurrentPage("dashboard")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
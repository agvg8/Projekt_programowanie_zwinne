import { useState } from "react";
import { createTask } from "../api/zadanieApi";

export default function AddTaskModal({ isOpen, onClose, projectId, onTaskCreated, currentTaskCount }) {
    const [formData, setFormData] = useState({
        nazwa: "",
        opis: "",
        priorytet: "LOW",
        status: "TODO"
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (formData.nazwa.trim().length < 3) {
            setError("Nazwa zadania musi mieć co najmniej 3 znaki.");
            setIsSubmitting(false);
            return;
        }

        try {
            const taskData = {
                nazwa: formData.nazwa,
                opis: formData.opis || null,
                kolejnosc: currentTaskCount + 1,
                priorytet: formData.priorytet,
                status: formData.status,
                projekt: {
                    projektId: projectId
                }
            };
            await createTask(taskData);
            onTaskCreated();
            setFormData({ nazwa: "", opis: "", priorytet: "LOW", status: "TODO" });
            onClose();
        } catch (err) {
            setError(err.message || "Błąd podczas tworzenia zadania");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h2>Dodaj nowe zadanie</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nazwa">Nazwa zadania *</label>
                        <input
                            type="text"
                            id="nazwa"
                            name="nazwa"
                            value={formData.nazwa}
                            onChange={handleChange}
                            placeholder="Wpisz nazwę zadania (min. 3 znaki)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="opis">Opis</label>
                        <textarea
                            id="opis"
                            name="opis"
                            value={formData.opis}
                            onChange={handleChange}
                            placeholder="Opisz zadanie..."
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="priorytet">Priorytet</label>
                        <select
                            id="priorytet"
                            name="priorytet"
                            value={formData.priorytet}
                            onChange={handleChange}
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DONE">DONE</option>
                        </select>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Anuluj
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Tworzenie..." : "Dodaj zadanie"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

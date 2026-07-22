import { useState } from "react";
import { createProject } from "../api/projektApi";

export default function AddProjectModal({ isOpen, onClose, onProjectCreated }) {
    const getTodayDateTimeString = () => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        nazwa: "",
        opis: "",
        data_oddania: getTodayDateTimeString()
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
            setError("Nazwa projektu musi mieć co najmniej 3 znaki.");
            setIsSubmitting(false);
            return;
        }

        try {
            const projectData = {
                nazwa: formData.nazwa,
                opis: formData.opis || null,
                data_oddania: formData.data_oddania ? `${formData.data_oddania}:00` : null
            };
            await createProject(projectData);
            onProjectCreated();
            setFormData({ nazwa: "", opis: "", data_oddania: getTodayDateTimeString() });
            onClose();
        } catch (err) {
            setError(err.message || "Błąd podczas tworzenia projektu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h2>Stwórz nowy projekt</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nazwa">Nazwa projektu *</label>
                        <input
                            type="text"
                            id="nazwa"
                            name="nazwa"
                            value={formData.nazwa}
                            onChange={handleChange}
                            placeholder="Wpisz nazwę projektu (min. 3 znaki)"
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
                            placeholder="Opisz krótko swój projekt..."
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data_oddania">Termin oddania (Deadline)</label>
                        <input
                            type="datetime-local"
                            id="data_oddania"
                            name="data_oddania"
                            value={formData.data_oddania}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Anuluj
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Tworzenie..." : "Utwórz projekt"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

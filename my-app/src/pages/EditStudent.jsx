import { useState } from "react";

export default function EditStudent({
                                        user,
                                        setCurrentPage,
                                    }) {

    const [formData, setFormData] =
        useState(user);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const saveChanges = () => {
        console.log("save", formData);

        setCurrentPage("admin");
    };

    return (
        <div className="edit-user-page">

            <h1>Edit User</h1>

            <div className="edit-form">

                <label>Email</label>

                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <label>First name</label>

                <input
                    name="imie"
                    value={formData.imie}
                    onChange={handleChange}
                />

                <label>Last name</label>

                <input
                    name="nazwisko"
                    value={formData.nazwisko}
                    onChange={handleChange}
                />

                <label>Role</label>

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option>ADMIN</option>
                    <option>MANAGER</option>
                    <option>USER</option>
                </select>

                <div className="edit-buttons">

                    <button
                        className="btn save-btn"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </button>

                    <button
                        className="btn back-btn"
                        onClick={() => setCurrentPage("admin")}
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>
    );
}
import { useState } from "react";
import keycloak from "../keycloak.js";

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
        fetch("http://localhost:8081/api/uzytkownik/update", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`
            },
            body: JSON.stringify({
                id: formData.uzytkownikId,
                imie: formData.imie,
                nazwisko: formData.nazwisko,
                email: formData.email,
                rola: formData.rola
            })
        }).then(() => {
            setCurrentPage("admin");
        });
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
                    name="rola"
                    value={formData.rola}
                    onChange={handleChange}
                >
                    <option value="admin">ADMIN</option>
                    <option value="manager">MANAGER</option>
                    <option value="user">USER</option>
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
                        // onClick={() => setCurrentPage("admin")}
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>
    );
}
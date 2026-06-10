import { useState } from "react";
import StudentCard from "../components/StudentCard";
import { students as initialStudents } from "../data/students";

export default function AdminPanel({
                                       setCurrentPage,
                                       setSelectedUser,
                                   }) {

    const [students, setStudents] =
        useState(initialStudents);

    const deleteUser = (id) => {
        setStudents(
            students.filter(
                (student) => student.studentId !== id
            )
        );
    };

    const editUser = (student) => {
        setSelectedUser(student);
        setCurrentPage("editUser");
    };

    return (
        <div className="admin-panel">

            <h1>Users</h1>

            <div className="users-list">
                {students.map((student) => (
                    <StudentCard
                        key={student.studentId}
                        student={student}
                        onEdit={editUser}
                        onDelete={deleteUser}
                    />
                ))}
            </div>

        </div>
    );
}
import {useEffect, useState} from "react";
import StudentCard from "../components/StudentCard";
import keycloak from "../keycloak.js";

export default function AdminPanel({
                                       setCurrentPage,
                                       setSelectedUser,
                                   }) {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8081/api/uzytkownik?page=${page}&size=${size}`,
            {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setStudents(data.content);
                setTotalPages(data.totalPages);
            });
    }, [page, size]);

    const editUser = (student) => {
        setSelectedUser(student);
        setCurrentPage("editUser");
    };

    const deleteUser = (id) => {
        fetch(`http://localhost:8081/api/uzytkownik/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        }).then(() => {
            setStudents(prev => prev.filter(s => s.uzytkownikId !== id));
        });
    };

    return (
        <div className="admin-panel">
            <h1>Users</h1>

            <div className="users-list">
                {students.map(student => (
                    <StudentCard
                        key={student.uzytkownikId}
                        student={student}
                        onEdit={editUser}
                        onDelete={deleteUser}
                    />
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                    Poprzednia
                </button>

                <span>Strona {page + 1} z {totalPages}</span>

                <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                >
                    Następna
                </button>

                <select
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                    }}
                >
                    <option value={5}>5 na stronę</option>
                    <option value={10}>10 na stronę</option>
                    <option value={20}>20 na stronę</option>
                </select>
            </div>
        </div>
    );
}
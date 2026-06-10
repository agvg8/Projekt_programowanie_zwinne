export default function StudentCard({
                                        student,
                                        onEdit,
                                        onDelete,
                                    }) {
    return (
        <div className="student-card">

            <div>
                <h3>
                    {student.imie} {student.nazwisko}
                </h3>

                <p>{student.email}</p>

                <span className="role-badge">
          {student.role}
        </span>
            </div>

            <div className="student-actions">
                <button
                    className="btn-edit"
                    onClick={() => onEdit(student)}
                >
                    Edit
                </button>

                <button
                    className="btn-delete"
                    onClick={() => onDelete(student.studentId)}
                >
                    Delete
                </button>
            </div>

        </div>
    );
}
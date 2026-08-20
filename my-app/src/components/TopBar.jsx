import { FaUserCircle } from "react-icons/fa";


export default function TopBar({
    onLogout,
    setCurrentPage,
    setEditedTask
}) {

    return (

        <div className="top-bar">


            <button

                className="btn add-task"

                onClick={() => {

                    if(setEditedTask){
                        setEditedTask(null);
                    }

                    if(setCurrentPage){
                        setCurrentPage("addTask");
                    }

                }}

            >
                + Nowe zadanie
            </button>



            <div

                className="profile-container"

                onClick={onLogout}

                title="Kliknij, aby się wylogować"

                style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"8px",
                    cursor:"pointer"
                }}

            >

                <FaUserCircle
                    className="profile-icon"
                />


                <span

                    style={{
                        fontSize:"14px",
                        fontWeight:"600"
                    }}

                >
                    Wyloguj
                </span>


            </div>


        </div>

    );

}
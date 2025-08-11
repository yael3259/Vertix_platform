import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "./userAPI";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/user/ShowUsers.css";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const ShowAllUsers = () => {
    const [arr, setArr] = useState([]);
    const [error, setError] = useState(null);
    const [removedUser, setRemovedUser] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [errorAlert, setErrorAlert] = useState(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);
    
    const fetchAllUsers = async () => {
        try {
            const res = await getAllUsers();
            setArr(res.data);
        } catch (err) {
            setError("Failed to fetch users");
        }
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            fetchAllUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };


    const closeRemoveModal = () => {
        setShowRemoveModal(false);
    };




    return (
        <div className="users-container">
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <p className="userTytle">All Users</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="users-grid">
                {arr.map((user) => (
                    <div className={`user-card ${user.role === "ADMIN" ? "admin-user" : ""}`} key={user._id}>
                        <img src={user.url || "https://cdn-icons-png.freepik.com/256/12259/12259393.png?ga=GA1.1.394280285.1712833522&"} width={25} height={25} id="urlPic" />
                        <p><strong>User Name: </strong>{user.userName}</p>
                        <p><strong>ID: </strong>{user._id}</p>
                        <p><strong>Email: </strong>{user.email}</p>
                        <p><strong>Role: </strong>{user.role}</p>
                        <p><strong>Enter Date: </strong>{user.enterDate.split("T")[0]}</p>

                        <button className="delete-user-btn" onClick={() => handleDelete(user._id)}>
                            <i className="fas fa-trash-alt"></i> Delete User
                        </button>
                    </div>
                ))}
            </div>

            {showRemoveModal && removedUser && (
                <div className="remove-modal">
                    <div className="modal-content">
                        <button className="X_button" onClick={closeRemoveModal}>
                            <i className="fas fa-times"></i>
                        </button>
                        <p className="err_cart">The user "{removedUser.userName}" was deleted</p>
                    </div>
                </div>
            )}
        </div>
    );
};

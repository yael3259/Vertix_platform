import "../styles/UsersTable.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, usersDisplayInTable } from "../routes/UserAPI";
import { FaTrash } from "react-icons/fa";
import { ConfirmUserDelete } from "../components/ConfirmUserDelete";



export const UsersTable = () => {
    const [usersArr, setUsersArr] = useState([]);
    const [search, setSearch] = useState("");
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            console.log("ffff")
            try {
                let res = await usersDisplayInTable();
                setUsersArr(res.data);
            } catch (err) {
                console.error("failed fetching users", err);
            }
        }
        fetchUsers();
    }, []);

    const filteredUsers = usersArr.filter((user) =>
        user.userName.toLowerCase().includes(search.toLowerCase())
    );

    const deleteAlert = (_id, userName) => {
        setUserToDelete({ _id, userName });
        setShowDeleteAlert(true);
    }

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsersArr(prev => prev.filter(user => user._id !== userId));
            setShowDeleteAlert(false);
        } catch (err) {
            console.error("failed", err);
        }
    };

    const closeDeleteAlert = () => {
        setShowDeleteAlert(false);
    }

    return (
        <div className="admin-access">
            <h1>ניהול משתמשים</h1>

            {showDeleteAlert && <ConfirmUserDelete user={userToDelete} onDelete={handleDeleteUser} onClose={closeDeleteAlert} />}

            <div className="searchBoxInTable">
                <input
                    type="text"
                    placeholder="חיפוש משתמש"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>שם משתמש</th>
                        <th>כינוי</th>
                        <th>אימייל</th>
                        <th>סטטוס</th>
                        <th>תאריך כניסה</th>
                        <th>נקודות</th>
                        <th>פוסטים</th>
                        <th>הישגים ובוסטים</th>
                        <th>תגים</th>
                        <th>חברים</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr
                            key={user._id}
                            className={user.role === "ADMIN" ? "adminCll" : "userCell"}
                            onClick={() => navigate(`/profile/${user._id}`)}
                        >
                            <td data-label="שם משתמש"><strong>{user.userName}</strong></td>
                            <td data-label="כינוי">{user.nickname || "-"}</td>
                            <td data-label="אימייל">{user.email}</td>
                            <td data-label="סטטוס">{user.role}</td>
                            <td data-label="תאריך הרשמה">{new Date(user.enterDate).toLocaleDateString()}</td>
                            <td data-label="נקודות">{user.points}</td>
                            <td data-label="פוסטים">{user.postCount}</td>
                            <td data-label="הישגים ובוסטים">{user.achievementBoostCount}</td>
                            <td data-label="תגים">
                                {user.tags?.map((tag, i) => (
                                    <span key={i} className={`tag ${tag.name}`}>
                                        {tag.name} ({tag.value})
                                    </span>
                                )) || "-"}
                            </td>
                            <td data-label="חברים">
                                <button
                                    className="deleteUserIcon"
                                    title="מחיקת משתמש"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteAlert(user._id, user.userName);
                                    }} >
                                    <FaTrash />
                                </button>

                                <div className="friendsWrapper">
                                    <span>{user.following?.length || 0}</span>

                                    <button
                                        className="deleteUserIconForMobile"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteAlert(user._id, user.userName);
                                        }}
                                    >
                                        מחיקת משתמש
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

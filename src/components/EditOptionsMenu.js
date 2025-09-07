import "../styles/EditOptionsMenu.css";
import { useState, useEffect } from "react";
import { deletePost } from "../routes/PostAPI";
import { DynamicErrorAlert } from "./DynamicErrorAlert";



export const EditOptionsMenu = ({ onDelete, onPostDeleted, onEdit, openPostEditor }) => {
    const [errorAlert, setErrorAlert] = useState(null);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);

            if (onPostDeleted)
                onPostDeleted(postId);
        }
        catch (err) {
            console.error(err, "failed");
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    }

    return (
    <div className="editPost" >
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}
            
            <button className="editOption" onClick={() => openPostEditor(onEdit)}>עריכת פוסט</button>
            <button className="deleteOption" onClick={() => handleDeletePost(onDelete)}>מחיקת פוסט</button>
        </div>
    )
}

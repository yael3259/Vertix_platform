import "../styles/EditOptionsMenu.css";
import { editPost } from "../routes/PostAPI";
import { deletePost } from "../routes/PostAPI";



export const EditOptionsMenu = (onDelete, onEdit) => {

    const handleEditPost = async (postId) => {
        try {
            let res = await editPost(postId);
            console.log(res, "succsses");
        }
        catch (err) {
            console.log(err, "failed")
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            let res = await deletePost(postId);
            console.log(res, "succsses");
        }
        catch (err) {
            console.log(err, "failed")
        }
    }

    return (
        <div className="editPost">
            <button className="editOption" onClick={() => handleEditPost(onEdit)}>עריכת פוסט</button>
            <button className="deleteOption" onClick={() => handleDeletePost(onDelete)}>מחיקת פוסט</button>
        </div>
    )
}

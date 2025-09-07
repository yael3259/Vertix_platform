import { useEffect, useState } from "react";
import { getPostById, editPost } from "../../routes/PostAPI";
import { DynamicErrorAlert } from "../../components/DynamicErrorAlert";
import "../../styles/post/EditPost.css";



export const EditPost = ({ postId, onClose, onPostEdited }) => {
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [errorAlert, setErrorAlert] = useState(null);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(postId);
                const post = res.data.post || res.data;
                setContent(post.content);
            } catch (err) {
                console.error("fetch post error", err);
                setErrorAlert(err.response.data.message || "שגיאה");
            }
        }
        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (content.length < 15 || content.length > 1000) {
            setError("תוכן הפוסט חייב להכיל בין 15-1000 תווים");
            return;
        }

        try {
            await editPost(postId, { content });
            onPostEdited();
            onClose();
        }
        catch (err) {
            console.error("edit post failed", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    return (
        <div className="editPostPage">
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}
            <form className="eps-form" onSubmit={handleSubmit} >
                <button className="close-eps" onClick={() => onClose()}>×</button>
                    <div className="eps-title">עדכון פוסט</div>

                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        placeholder={content}
                        className="eps-textarea"
                    />

                {error && <div className="eps-error">{error}</div>}

                <div className="eps-actions">
                    <button type="submit" className="eps-save">שמירה</button>
                </div>
            </form>
        </div>
    );
};
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Link2, Upload } from "lucide-react";
import "../../styles/post/AddPost.css";
import { addPost } from "../../routes/PostAPI";
import { useUserContext } from "../../contexts/UserContext";
import EmojiPicker from 'emoji-picker-react';
import achievedBGForPost from "../../files/achievedBGForPost.JPG";
import guestMode from "../../files/icons/guestMode.png";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const AddPostForm = () => {
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();
    const [color, setColor] = useState("#ffffff");
    const [showPicker, setShowPicker] = useState(false);
    const [content, setContent] = useState("");
    const [errorAlert, setErrorAlert] = useState(null);
    const navigate = useNavigate();
    const { user } = useUserContext();
    const location = useLocation();
    const fromNotifPage = location.state?.fromNotifPage;
    const { descriptionForPost } = useParams();
    const [imagePreview, setImagePreview] = useState(null);
    let token = user.tokenUser;

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    useEffect(() => {
        if (descriptionForPost) {
            setContent(descriptionForPost);
            setValue("content", descriptionForPost);
        }
    }, [descriptionForPost]);

    useEffect(() => {
        setValue("backgroundColor", opacityBackground(color, 0.2));
    }, [color]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (data.imagePost && data.imagePost.size && data.imagePost.size > maxSize) {
            alert("תמונה גדולה מידי");
            return;
        }

        formData.append("category", data.category.value);
        formData.append("content", content);
        formData.append("backgroundColor", data.backgroundColor);
        formData.append("postingDate", new Date().toISOString());

        if (fromNotifPage) {
            formData.append("imagePost", achievedBGForPost);
        } else {
            formData.append("imagePost", data.imagePost);
        }
        if (data.mediaFile && data.mediaFile[0]) {
            formData.append("mediaFile", data.mediaFile[0]);
        }

        try {
            await addPost(formData, token);
            navigate("/feed");
        } catch (err) {
            console.error("שגיאה בשליחת הפוסט:", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    const handleEmojiClick = (emojiData) => {
        setContent(prevContent => prevContent + emojiData.emoji);
        setShowPicker(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const opacityBackground = (hex, alpha = 0.5) => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const handleColorChange = (e) => {
        const hexColor = e.target.value;
        setColor(hexColor);
        const rgbaColor = opacityBackground(hexColor, 0.2);
        setValue("backgroundColor", rgbaColor);
    };

    const categoryOptions = [
        { value: 'השראה ורגש', label: 'השראה ורגש' },
        { value: 'שאלות והתלבטויות', label: 'שאלות והתלבטויות' },
        { value: 'ממים ובדיחות', label: 'ממים ובדיחות' },
        { value: 'טיפים שימושיים', label: 'טיפים שימושיים' },
        { value: 'אקטואליה🎗️', label: 'אקטואליה🎗️' },
        { value: 'פיתוח אישי', label: 'פיתוח אישי' },
        { value: 'עיצוב ויצירה', label: 'עיצוב ויצירה' },
        { value: 'טכנולוגיה וחדשנות', label: 'טכנולוגיה וחדשנות' },
        { value: 'הישג חדש🎖️', label: 'הישג חדש🎖️' }
    ];

    if (user.userId === "guest") {
        return <div className="profilePage" id='noUserLogged'>
            <img src={guestMode} className="no-user-icon" alt="אורח" />
            <strong>משתמש לא מחובר</strong>
            <p>התחבר או הרשם <NavLink to="/login" id='linkToLogin'>כאן</NavLink> כדי לפרסם פוסט</p>
        </div>
    }

    return (
        <div className="addPostPage">
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <form onSubmit={handleSubmit(onSubmit)} className="AddPostForm" encType="multipart/form-data">
                <h2>הוספת פוסט חדש</h2>

                <label>קטגוריה<span id="requireInput"> *</span></label>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "שדה חובה" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={categoryOptions}
                            placeholder="בחר קטגוריה"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    )}
                />
                {errors.category && <span className="error">{errors.category.message}</span>}

                <label>תוכן<span id="requireInput"> *</span></label>
                <div className="textarea-wrapper">
                    <textarea
                        className="post-content"
                        {...register("content", {
                            required: "שדה חובה",
                            minLength: { value: 15, message: "לפחות 15 תווים" },
                            maxLength: { value: 1000, message: "מקסימום 1000 תווים" },
                        })}
                        placeholder="מה תרצה/י לשתף?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    <div
                        type="button"
                        className="emoji-button"
                        onClick={() => setShowPicker(!showPicker)}
                    >
                        😊
                    </div>
                    {showPicker && (
                        <div className="emoji-picker-container">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
                {errors.content && <span className="error">{errors.content.message}</span>}

                <div className="filesPart">
                    {fromNotifPage ? (
                        <div className="preview-achievement-img">
                            <p style={{ fontWeight: 'bold', textAlign: "right" }}>תמונת רקע (נוספת אוטומטית)</p>
                            <img src={achievedBGForPost} alt="רקע להישג שהושלם" className="achievementCompletedBG" />
                        </div>
                    ) : (<>
                        <p style={{ fontWeight: 'Bold' }}>הוספת וידאו / תמונה</p>
                        <p className="choose_file_label">בחר/י באפשרות אחת והעלה/י קובץ תקין עם סיומת jpeg /.png /.mp4.</p>
                        <div className="apload_files">
                            <div className="aploadfile">
                                <label><Link2 size={18} />
                                    קישור לוידאו / תמונה
                                </label>
                                <input type="text" {...register("imagePost")} placeholder="כתובת URL" />
                            </div>

                            <div className="aploadfile">
                                <label><Upload size={15} />
                                    העלאת תמונה מהמחשב
                                </label>
                                <input type="file" accept="image/*,video/*" {...register("mediaFile")} onChange={handleFileChange} />
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="imagePreview">
                                <img src={imagePreview} alt="תצוגה מקדימה" className="preview-image" />
                            </div>
                        )}
                    </>)}
                </div>

                <label>צבע רקע הפוסט</label>
                <div className="HEXcolor">
                    <input
                        type="color"
                        value={color}
                        onChange={handleColorChange}
                        className="bg_color_change"
                    />{color}
                </div>

                <input
                    type="hidden"
                    {...register("backgroundColor", { required: true })}
                />

                <button type="submit" className="addPostSubmit">פרסם פוסט</button>
            </form>
        </div>
    );
};

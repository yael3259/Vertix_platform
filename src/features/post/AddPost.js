import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Link2, Upload } from "lucide-react";
import "./AddPost.css";
import { addPost } from "./postAPI";
import { Bold } from "lucide-react";



export const AddPostForm = () => {
    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();
    const [color, setColor] = useState("#ffffff");
    const navigate = useNavigate();

    useEffect(() => {
        setValue("backgroundColor", getBackgroundColorWithOpacity(color, 0.2));
    }, []);

    const onSubmit = async (data) => {
        console.log(data);

        const formData = new FormData();

        formData.append("category", data.category.value);
        formData.append("content", data.content);
        formData.append("imagePost", data.imagePost);
        formData.append("backgroundColor", data.backgroundColor);

        if (data.mediaFile && data.mediaFile[0]) {
            formData.append("mediaFile", data.mediaFile[0]);
        }

        try {
            const res = await addPost(formData);
            console.log("Response from server:", res);
            alert("הפוסט נוסף בהצלחה");
            navigate("/feed");
        } catch (err) {
            console.error("שגיאה בשליחת הפוסט:", err);
            alert("אירעה שגיאה בשליחת הפוסט");
        }
    };

    const onError = (formErrors) => {
        console.log("Validation failed:", formErrors);
    };

    const getBackgroundColorWithOpacity = (hex, alpha = 0.5) => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const handleColorChange = (e) => {
        const hexColor = e.target.value;
        setColor(hexColor);
        const rgbaColor = getBackgroundColorWithOpacity(hexColor, 0.2);
        setValue("backgroundColor", rgbaColor);
    };

    const categoryOptions = [
        { value: 'פיתוח', label: 'פיתוח' },
        { value: 'עיצוב', label: 'עיצוב' },
        { value: 'רעיון', label: 'רעיון' },
        { value: 'השראה', label: 'השראה' }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="AddPostForm" encType="multipart/form-data">
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
            <textarea
                {...register("content", {
                    required: "שדה חובה",
                    minLength: { value: 15, message: "לפחות 15 תווים" },
                    maxLength: { value: 150, message: "מקסימום 150 תווים" },
                })}
                placeholder="מה תרצה לשתף?"
            ></textarea>
            {errors.content && <span className="error">{errors.content.message}</span>}

            <div className="filesPart">
                <p style={{ fontWeight: 'Bold' }}>הוספת וידאו/ תמונה</p>
                <p className="choose_file_label">בחרו באפשרות אחת והעלו קובץ תקין עם סיומת jpeg /.png /.mp4.</p>
                <div className="apload_files">
                    <div className="aploadfile">
                        <label><Link2 size={18} />
                            קישור לוידאו/ תמונה
                        </label>
                        <input type="text" {...register("imagePost")} placeholder="כתובת URL" />
                    </div>

                    <div className="aploadfile">
                        <label><Upload size={15} />
                            העלאת תמונה מהמחשב
                        </label>
                        <input type="file" accept="image/*,video/*" {...register("mediaFile")} />
                    </div>
                </div>
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

            <button type="submit">פרסם פוסט</button>
        </form>
    );
};

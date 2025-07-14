import React from 'react';
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import "../../styles/achievement/AddAchievement.css";
import { addAchievement, addBoost } from '../../routes/AchievementAPI';
import { useUserContext } from '../../contexts/UserContext';



export const AddAchievement = () => {
    const { register, handleSubmit, formState: { errors }, control } = useForm();
    const navigate = useNavigate();
    const { user } = useUserContext();
    let token = user.tokenUser;
    const { boost } = useParams();
    const isBoostMode = boost === 'boost';


    const onSubmit = async (data) => {
        console.log(data);
        let shouldCreatePost = false;
        let descriptionForPost = data.description;

        data.category = data.category.value;

        try {
            if (isBoostMode) {
                const resBoost = await addBoost(data, token);
                console.log('הבוסט נוסף בהצלחה', resBoost);
                shouldCreatePost = resBoost.data.shouldCreatePost;
            }
            else {
                const resAchievement = await addAchievement(data, token);
                console.log('ההישג נוסף בהצלחה', resAchievement);
                shouldCreatePost = resAchievement.data.shouldCreatePost;
            }

            if (shouldCreatePost === "yes") {
                navigate(`/addPost/${descriptionForPost}`);
            }
            else
                navigate(`/profile/${user.userId}`);

        } catch (err) {
            console.error("הוספת הישג נכשלה", err);
        }
    };

    const onError = (formErrors) => {
        console.log("Validation failed:", formErrors);
    };

    const categoryOptions = [
        { value: 'פיתוח אישי', label: 'פיתוח אישי' },
        { value: 'עיצוב ויצירה', label: 'עיצוב ויצירה' },
        { value: 'טכנולוגיה וחדשנות', label: 'טכנולוגיה וחדשנות' },
        { value: 'ספורט ואתגר', label: 'ספורט ואתגר' },
        { value: 'התנדבות והשפעה חברתית', label: 'התנדבות והשפעה חברתית' },
        { value: 'מוזיקה והופעה', label: 'מוזיקה והופעה' },
        { value: 'מדע ולמידה', label: 'מדע ולמידה' },
        { value: 'יזמות ועסקים', label: 'יזמות ועסקים' },
        { value: 'כישורי חיים', label: 'כישורי חיים' },
        { value: 'מנהיגות והובלה', label: 'מנהיגות והובלה' },
        { value: 'משחק ודרמה', label: 'משחק ודרמה' }
    ];

    return (
        <div className="achievementPage">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="achievementFormContainer" >

                <h2>הוספת הישג חדש</h2>

                <label htmlFor="title">כותרת ההישג<span id="require_Input"> *</span></label>
                <input {...register("title", {
                    required: "שדה חובה",
                    minLength: { value: 4, message: "מינימום 4 תווים" },
                    maxLength: { value: 40, message: "מקסימום 40 תווים" }
                })}
                    placeholder="כותרת" />
                {errors.title && <span className="error">{errors.title.message}</span>}


                <label htmlFor="category">קטגוריה<span id="require_Input"> *</span></label>
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
                            classNamePrefix="react-select-achivement"
                        />
                    )}
                />
                {errors.category && <span className="error">{errors.category.message}</span>}


                <label htmlFor="description" >תיאור הישג<span id="require_Input"> *</span></label>
                <textarea
                    {...register("description", {
                        required: "שדה חובה",
                        minLength: { value: 10, message: "מינימום 10 תווים" },
                        maxLength: { value: 350, message: "מקסימום 350 תווים" }
                    })}
                    placeholder="מה תרצה/י להשיג?"
                />
                {errors.description && <span className="error">{errors.description.message}</span>}


                {!isBoostMode && <><label htmlFor="targetDate" >תאריך יעד<span id="require_Input"> *</span></label>
                    <input type='date'
                        {...register("targetDate", {
                            required: "שדה חובה",
                        })}
                    />
                    {errors.targetDate && <span className="error">{errors.targetDate.message}</span>}</>}

                <div className="postOptionWrapper postPreferenceContainer">
                    <label htmlFor="shouldCreatePost" className="postPreferenceTitle">מעוניין/ת לפרסם פוסט על ההישג החדש?<span id="require_Input"> *</span></label>
                    <Controller
                        name="shouldCreatePost"
                        control={control}
                        {...register("shouldCreatePost", {
                            required: "שדה חובה",
                        })}
                        render={({ field }) => (
                            <div className="radio-button-group">
                                <label className="radio-button-label">
                                    <input
                                        {...field}
                                        type="radio"
                                        value="yes"
                                        id="post-yes"
                                        checked={field.value === "yes"}
                                    />
                                    כן
                                </label>
                                <label className="radio-button-label">
                                    <input
                                        {...field}
                                        type="radio"
                                        value="no"
                                        id="post-no"
                                        checked={field.value === "no"}
                                    />
                                    לא
                                </label>
                            </div>
                        )}
                    />
                </div>
                {errors.shouldCreatePost && <span className="error">{errors.shouldCreatePost.message}</span>}

                <button type="submit" className="submitButton">הוסף הישג</button>
            </form>
        </div>
    );
}
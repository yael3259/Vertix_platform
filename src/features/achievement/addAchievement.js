import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import "./addAchievement.css";
import { addAchievement } from './achievementAPI';




export const AddAchievement = () => {
    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();
    const navigate = useNavigate();


    const onSubmit = async (data) => {
        console.log(data);

        data.category = data.category.value;

        try {
            const res = await addAchievement(data);
            console.log('ההישג נוסף בהצלחה', res);
            navigate("/feed");
        } catch (err) {
            console.error("הוספת הישג נכשלה", err);
        }
    };

    const onError = (formErrors) => {
        console.log("Validation failed:", formErrors);
    };


    const categoryOptions = [
        { value: 'השראה ורגש', label: 'השראה ורגש' },
        { value: 'שאלות והתלבטויות', label: 'שאלות והתלבטויות' },
        { value: 'ממים ובדיחות', label: 'ממים ובדיחות' },
        { value: 'טיפים שימושיים', label: 'טיפים שימושיים' },
        { value: 'פיתוח אישי', label: 'פיתוח אישי' },
        { value: 'עיצוב ויצירה', label: 'עיצוב ויצירה' },
        { value: 'טכנולוגיה וחדשנות', label: 'טכנולוגיה וחדשנות' }
    ];

    return (
        <div className="achievementPage">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="achievementFormContainer" >

                <h2>הוספת הישג חדש</h2>

                <label htmlFor="title">כותרת ההישג<span id="require_Input"> *</span></label>
                <input {...register("title", {
                    required: "שדה חובה",
                    minLength: { value: 4, message: "מינימום 4 תווים" },
                    maxLength: { value: 20, message: "מקסימום 20 תווים" }
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
                        maxLength: { value: 100, message: "מקסימום 100 תווים" }
                    })}
                    placeholder="מה תרצה להשיג?"
                />
                {errors.description && <span className="error">{errors.description.message}</span>}
                

                <label htmlFor="targetDate" >תאריך יעד<span id="require_Input"> *</span></label>
                <input type='date'
                    {...register("targetDate", {
                        required: "שדה חובה",
                    })}
                />
                {errors.targetDate && <span className="error">{errors.targetDate.message}</span>}
                

                <button type="submit" className="submitButton">הוסף הישג</button>
            </form>
        </div>
    );
}
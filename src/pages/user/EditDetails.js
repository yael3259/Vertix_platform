import "../../styles/user/EditDetails.css";
import { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useUserContext } from "../../contexts/UserContext";
import { editUserDetails } from "../../routes/UserAPI";
import { useNavigate } from "react-router-dom";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';


export const EditForm = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const [errorAlert, setErrorAlert] = useState(null);
    const { user, setUser } = useUserContext();
    const userId = user.userId;
    const navigate = useNavigate();

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const genderOptions = [
        { value: 'זכר', label: 'זכר' },
        { value: 'נקבה', label: 'נקבה' },
        { value: 'אחר', label: 'אחר' },
    ];

    const onSubmit = async (data) => {
        const editedData = {
            ...data,
            gender: data.gender?.value || user.genderUser
        };

        try {
            const res = await editUserDetails(userId, editedData);
            const updatedUser = res.data;

            localStorage.setItem('userName', updatedUser.userName || '');
            localStorage.setItem('nickNameUser', updatedUser.nickname || '');
            localStorage.setItem('emailUser', updatedUser.email || '');
            localStorage.setItem('genderUser', updatedUser.gender || '');
            localStorage.setItem('profilePictureUser', updatedUser.profilePicture || '');
            localStorage.setItem('enterDateUser', updatedUser.enterDate || '');
            localStorage.setItem('tagsUser', JSON.stringify(updatedUser.tags || []));
            localStorage.setItem('skillsUser', JSON.stringify(updatedUser.skills || []));

            setUser(prev => ({
                ...prev,
                userName: updatedUser.userName || prev.userName,
                nickNameUser: updatedUser.nickname || prev.nickNameUser,
                emailUser: updatedUser.email || prev.emailUser,
                genderUser: updatedUser.gender || prev.genderUser,
                profilePictureUser: updatedUser.profilePicture || prev.profilePictureUser,
                enterDateUser: updatedUser.enterDate || prev.enterDateUser,
                tagsUser: updatedUser.tags || prev.tagsUser,
                skillsUser: updatedUser.skills || prev.skillsUser,
            }));

            navigate(`/profile/${userId}`);
        } catch (err) {
            console.error("failed to edit user details", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    return (
        <div className="editUserPage">
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <form className="editUserFormContainer" onSubmit={handleSubmit(onSubmit)}>
                <p className="editUserTitle">עריכת פרטים אישיים</p>

                <label htmlFor="userName" className="editUserLabel">שם מלא</label>
                <input
                    className="editUserInput"
                    {...register('userName', {
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                    })}
                    placeholder={user.userName}
                />
                {errors.userName && <span className="editUserError">{errors.userName.message}</span>}

                <label htmlFor="nickname" className="editUserLabel">כינוי</label>
                <input
                    className="editUserInput"
                    {...register('nickname')}
                    placeholder={user.nickNameUser || "לא הוגדר כינוי"}
                />
                {errors.nickname && <span className="editUserError">{errors.nickname.message}</span>}

                <label htmlFor="email" className="editUserLabel">כתובת מייל</label>
                <input
                    className="editUserInput"
                    {...register('email')}
                    placeholder={user.emailUser}
                />
                {errors.email && <span className="editUserError">{errors.email.message}</span>}

                <label htmlFor="gender" className="editUserLabel">מין</label>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={genderOptions}
                            placeholder={user.genderUser}
                            className="editUserSelectContainer"
                            classNamePrefix="editUserSelect"
                        />
                    )}
                />
                {errors.gender && <span className="editUserError">{errors.gender.message}</span>}

                <label htmlFor="profilePicture" className="editUserLabel">קישור לתמונת פרופיל (URL)</label>
                <input
                    className="editUserInput"
                    {...register('profilePicture', {
                        pattern: {
                            value: /^https?:\/\/.+\.(jpg|jpeg|png)$/,
                            message: 'יש להזין כתובת URL תקינה לתמונה',
                        }
                    })}
                    placeholder={user.profilePictureUser || "לא הוגדרה תמונה"}
                />
                {errors.profilePicture && <span className="editUserError">{errors.profilePicture.message}</span>}

                <button type="submit" className="editUserSubmitButton">עדכן פרטים</button>
            </form>
        </div>
    );
};

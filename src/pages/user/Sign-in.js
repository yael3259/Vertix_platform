import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { addUser } from '../../routes/UserAPI';
import "../../styles/user/Log-in.css";
import { FaUser, FaLock, FaEnvelope, FaLink, FaStar } from 'react-icons/fa';
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const RegistrationPage = () => {
    const [userName, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [errorAlert, setErrorAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = {};
        if (!userName || userName.length < 3 || userName.length > 12)
            validationErrors.userName = "שם משתמש חייב להכיל בין 3-12 תווים";
        if (nickname.length === 1 || nickname.length > 12)
            validationErrors.nickname = "כינוי חייב להכיל בין 2-12 תווים";
        if (!password || password.length < 5 || password.length > 9)
            validationErrors.password = "סיסמה חייבת להכיל בין 5-9 תווים";
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailPattern.test(email))
            validationErrors.email = "כתובת אימייל לא תקינה";
        if (!gender)
            validationErrors.gender = "מגדר הוא שדה חובה";
        if (profilePicture && !/^https?:\/\/[^\s]+$/.test(profilePicture))
            validationErrors.profilePicture = "כתובת URL לא תקינה";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);

        try {
            await addUser({ email, password, userName, nickname, gender, profilePicture });
            navigate("/login");
        } catch (err) {
            console.error("faild to sign in user", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" id='reg_container'>
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">הרשמה</h2>

                <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        placeholder="שם משתמש"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field_login"
                    />
                </div>
                {errors.userName && <p className="error_enterence">{errors.userName}</p>}

                <div className="input-wrapper">
                    <FaStar className="input-icon" />
                    <input
                        type="text"
                        placeholder="(אופציונלי) כינוי"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="input-field_login"
                    />
                </div>
                {errors.nickname && <p className="error_enterence">{errors.nickname}</p>}

                <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        placeholder="אימייל"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field_login"
                    />
                </div>
                {errors.email && <p className="error_enterence">{errors.email}</p>}

                <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field_login"
                    />
                </div>
                {errors.password && <p className="error_enterence">{errors.password}</p>}

                <div className="input-wrapper_radio gender-wrapper">
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="זכר"
                                checked={gender === "זכר"}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            זכר
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="נקבה"
                                checked={gender === "נקבה"}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            נקבה
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="אחר"
                                checked={gender === "אחר"}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            אחר
                        </label>
                    </div>
                    <label className="gender-title">בחר מגדר</label>
                </div>
                {errors.password && <p className="error_enterence">{errors.gender}</p>}

                <div className="input-wrapper">
                    <FaLink className="input-icon" />
                    <input
                        type="url"
                        placeholder="קישור לתמונה (אופציונלי)"
                        value={profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                        className="input-field_login"
                    />
                </div>
                {errors.profilePicture && <p className="error_enterence">{errors.profilePicture}</p>}

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <span className="user_spinner"></span> : "הרשם"}
                </button>

                <div className="form-links">
                    <NavLink to="/login" className="form-link">כבר רשום? התחבר</NavLink>
                </div>
            </form>
        </div>
    );
};

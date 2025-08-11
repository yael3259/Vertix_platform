import { useState } from "react";
import { NavLink } from "react-router-dom";
import { resetPasswordUser } from "../../routes/UserAPI";
import { FaLock, FaEnvelope } from "react-icons/fa";
import "../../styles/user/Log-in.css";
import "../../styles/user/ForgotPassword.css";



export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email || !password || !email && !password) {
            setError("אימייל וסיסמה הם שדות חובה");
            return;
        }

        setLoading(true);

        try {
            await resetPasswordUser({ email, password });
            setMessage("הסיסמה שונתה בהצלחה");
        } catch (err) {
            setError("שגיאה באיפוס הסיסמה");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">איפוס סיסמה</h2>

                <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="כתובת אימייל"
                        className="input-field_login"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        name="password"
                        placeholder="סיסמה חדשה"
                        className="input-field_login"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {message && <p className="success_enterence">{message}</p>}
                {error && <p className="error_enterence">{error}</p>}

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <span className="user_spinner"></span> : "איפוס"}
                </button>

                <NavLink to="/login" className="form-link">
                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                    חזור להתחברות
                </NavLink>
            </form>
        </div>
    );
};

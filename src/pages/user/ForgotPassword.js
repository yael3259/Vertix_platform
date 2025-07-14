import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        setLoading(true);

        try {
            const res = await resetPasswordUser({ email, password });
            setMessage("הסיסמה שונתה בהצלחה");
            setError("");
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
                        required
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
                        required
                    />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <span className="user_spinner"></span> : "איפוס"}
                </button>

                {message && <p className="success-reset">{message}</p>}
                {error && <p className="faild-reset">{error}</p>}

                <NavLink to="/login" className="form-link">
                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                    חזור להתחברות
                </NavLink>
            </form>
            <ToastContainer position="bottom-center" />
        </div>
    );
};

import { NavLink, useNavigate } from 'react-router-dom';
import { login, log_outUser } from './userAPI';
import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faildAlert, successAlert, warningAlert } from "../../alerts/All_Alerts";
import './loginPage.css';
import { NavBar } from '../../NavBar';
import { useUserContext } from '../../contexts/user_context';
import { FaEnvelope, FaLock } from 'react-icons/fa';



export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      warningAlert("אנא מלא את כל השדות");
      return;
    }
    setLoading(true);
    try {
      let res = await login({ email, password });
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userName", res.data.userName);
      localStorage.setItem("url", res.data.url);
      localStorage.removeItem("cartItems");
      setUser({
        userId: res.data._id,
        userName: res.data.userName,
        userRole: res.data.role,
        url: res.data.url
      });
      navigate("/List");
    } catch (err) {
      faildAlert(err.response?.data?.message || "הייתה שגיאה. אנא נסה שוב.")
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await log_outUser(userId);
      localStorage.clear();
      setUser(null);
      successAlert("יצאת בהצלחה למצב אורח.");
      navigate("/");
    } catch (err) {
      console.error("שגיאה ביציאה:", err.response?.data || err.message);
    }
  };

  return (
    <div className="login-container">
      {/* <NavBar userName={user?.userName || "אורח"} /> */}
      <form className="login-form" onSubmit={handleSubmit}>
        {user?.userName && <p onClick={logOut} className='logout'>התנתק</p>}
        <h2 className="login-title">התחברות</h2>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="אימייל"
            onChange={handleEmailChange}
            required
            className="input-field_login"
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="סיסמה"
            onChange={handlePasswordChange}
            required
            className="input-field_login"
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? <span className="user_spinner"></span> : "התחבר"}
        </button>

        <div className="form-links">
          <NavLink to="/reset_pass" className="form-link">שכחת סיסמה?</NavLink>
          <NavLink to="/signin" className="form-link">צור חשבון</NavLink>
        </div>
      </form>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default LoginForm;

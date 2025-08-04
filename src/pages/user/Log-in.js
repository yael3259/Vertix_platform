import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { login } from '../../routes/UserAPI';
import "react-toastify/dist/ReactToastify.css";
import "../../styles/user/Log-in.css";
import { useUserContext } from '../../contexts/UserContext';
import log_out from "../../files/icons/log_out.png"



export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserContext();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!email || !password) {
      validationErrors.password = "אימייל וסיסמה הם שדות חובה"

      if (Object.keys(validationErrors).length > 0)
        setErrors(validationErrors);
      return;
    }
    setLoading(true);

    try {
      let res = await login({ email, password });

      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("tokenUser", res.data.token);
      localStorage.setItem("userName", res.data.userName);
      localStorage.setItem("nickNameUser", res.data.nickname);
      localStorage.setItem("genderUser", res.data.gender);
      localStorage.setItem("profilePictureUser", res.data.profilePicture);
      localStorage.setItem("skillsUser", res.data.skills);
      localStorage.setItem("tagsUser", res.data.tags);
      localStorage.setItem("enterDateUser", res.data.enterDate);
      localStorage.setItem("emailUser", res.data.email);
      localStorage.setItem("notificationsUser", res.data.notifications);
      localStorage.setItem("lengthNotificationsUser", res.data.count); // כמות ההתראות
      localStorage.setItem("pointsUser", res.data.points);

      console.log("user loged-in successfully", res);

      setUser({
        userId: res.data._id,
        userRole: res.data.role,
        tokenUser: res.data.token,
        userName: res.data.userName,
        nickNameUser: res.data.nickname,
        genderUser: res.data.gender,
        profilePictureUser: res.data.profilePicture,
        skillsUser: res.data.skills,
        tagsUser: res.data.tags,
        enterDateUser: res.data.enterDate,
        emailUser: res.data.email,
        pointsUser: res.data.points
      });

      navigate("/Feed");
    }
    catch (err) {
      console.error("faild to log in user", err);
    }
    finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("nickNameUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("genderUser");
    localStorage.removeItem("profilePictureUser");
    localStorage.removeItem("tokenUser");
    localStorage.removeItem("skillsUser");
    localStorage.removeItem("tagsUser");
    localStorage.removeItem("enterDateUser");
    localStorage.removeItem("emailUser");
    localStorage.removeItem("notificationsUser");
    localStorage.removeItem("lengthNotificationsUser");
    localStorage.removeItem("pointsUser");

    setUser({
      userId: "guest",
      userName: "אורח",
      nickNameUser: "",
      userRole: "guest",
      genderUser: "אחר",
      profilePictureUser: "",
      tokenUser: null,
      skillsUser: [],
      tagsUser: [],
      enterDateUser: null,
      emailUser: "",
      notificationsUser: [],
      pointsUser: null
    });
    console.log("user logged out successfully");
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {user?.userId && <p onClick={logOut} className='logout'><img src={log_out} className='log_outIcon' />התנתק</p>}
        <h2 className="login-title">התחברות</h2>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            value={email}
            placeholder="אימייל"
            onChange={(e) => setEmail(e.target.value)}

            className="input-field_login"
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            value={password}
            placeholder="סיסמה"
            onChange={(e) => setPassword(e.target.value)}

            className="input-field_login"
          />
        </div>
        {errors.password && <p className="error_enterence">{errors.password}</p>}

        <button type="submit" className="login-btn">
          {loading ? <span className="user_spinner"></span> : "התחבר"}
        </button>

        <div className="form-links">
          <NavLink to="/reset_pass" className="form-link">?שכחת סיסמה</NavLink>
          <NavLink to="/signin" className="form-link">צור חשבון</NavLink>
        </div>
      </form>
    </div>
  );
};
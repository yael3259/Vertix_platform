import React from 'react';
import "../styles/BoostInvite.css";
import { useNavigate } from 'react-router-dom';
import ship from "../files/icons/ship.gif";
import diamond_gem from "../files/icons/diamond_gem.png";



export const BoostInvite = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="boost-overlay">
      <div className="boost-box">
        <button className="boost-close" onClick={onClose}>×</button>
        <div className='boost-title-section'>
          <h2 className="boost-title">הבוסט השבועי<br />נפתח היום!</h2>
          <img src={ship} className='boost-icon rocket' alt="חללית"/>
        </div>
        <p className="boost-description">
          רוצים לטרוף את השבוע <strong>ולצבור נקודות במהירות שיא?</strong><br />
          על כל יום בשבוע שבו תשלימו את הבוסט, תקבלו <br/>
          <img src={diamond_gem} className="gemIconInProfile" id='gemSize' alt="יהלום"/> פי 4 נקודות! 
          <img src={diamond_gem} className="gemIconInProfile" id='gemSize' alt="יהלום"/><br />
          זו ההזדמנות שלכם לזנק לטופ בלוח המובילים!
        </p>

        <button
          className="boost-button"
          onClick={() => navigate('/profile/addAchievement/boost')}
        >
          כן, אני רוצה להתחיל!
        </button>
      </div>
    </div>
  );
};
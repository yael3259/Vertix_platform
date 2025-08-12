import React from 'react';
import "../styles/EarningPointsAlert.css";
import { useNavigate } from 'react-router-dom';
import clear_diamond from "../files/icons/clear_diamond.png"



export const EarningPointsAlert = ({ onClose, type }) => {
  const points = type === "boost" ? 20 : 5;

  return (
    <div className="points-overlay">
      <div className="points-modal">
        <button className="points-close" onClick={onClose}>×</button>
        <p className="points-description">
          <strong>צברת {points} נקודות!</strong><br />
          <img src={clear_diamond} className="clear_gem-icon" alt="יהלום"/><br />
          אם תצליח/י לעמוד באתגר ולסמן בטבלה מבלי לפספס אף יום, סכום הנקודות יוכפל
        </p>
      </div>
    </div>
  );
};

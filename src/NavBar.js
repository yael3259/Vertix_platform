import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, Cloud } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import home from "./files/icons/home.png";
import profile from "./files/icons/profile.png";
import notification from "./files/icons/notification.png";
import '@fortawesome/fontawesome-free/css/all.min.css';
// import from "./files/icons/";



export const NavBar = () => {

    return (
        <div className="navbar_page">
            <div className="navbar_left">
                <NavLink to="/feed" className="logo_nav-link">
                    <div className="logo">Vertix</div>
                </NavLink>
            </div>

            <div className="navbar_center">
                <div className="links_list">
                    <NavLink to="/contact" className="nav-link">
                        <div className="nav-item">
                            <img src={home} width={20} height={20} alt="צור קשר" />
                            <span>צור קשר</span>
                        </div>
                    </NavLink>
                    <NavLink to="/notifications" className="nav-link">
                        <div className="nav-item">
                            <img src={notification} width={20} height={20} alt="התראות" />
                            <span>התראות</span>
                        </div>
                    </NavLink>
                    <NavLink to="/profile" className="nav-link">
                        <div className="nav-item">
                            <img src={profile} width={20} height={20} alt="פרופיל" />
                            <span>פרופיל</span>
                        </div>
                    </NavLink>
                    <NavLink to="/feed" className="nav-link">
                        <div className="nav-item">
                            <img src={home} width={20} height={20} alt="בית" />
                            <span>בית</span>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div className="navbar_right">
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input type="text" className="search_in_navbar" placeholder="חיפוש" />
                </div>
            </div>
        </div>
    );
};
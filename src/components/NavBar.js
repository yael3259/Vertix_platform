import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import home from "../files/icons/home.png";
import profile from "../files/icons/profile.png";
import notification from "../files/icons/notification.png";
import contact from "../files/icons/contact.png";
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../files/logo.png';
import leader_board from '../files/icons/leader_board.png'
import { FaBars } from "react-icons/fa";
import { useUserContext } from "../contexts/UserContext";
import { getUsersByValue } from "../routes/UserAPI";



export const NavBar = () => {
    const { user, notificationsCount, fetchNotifications } = useUserContext();
    const [searchName, setSearchName] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const location = useLocation();
    const isFeedPage = location.pathname.startsWith("/feed");
    const isProfilePage = location.pathname.startsWith("/profile");
    const isNotificationsPage = location.pathname.startsWith("/notifications");
    const isContactPage = location.pathname.startsWith("/contact");
    const isBoardPage = location.pathname.startsWith("/board");

    useEffect(() => {
        fetchNotifications();

        // פונקציה שסוגרת את תפריט המובייל בעת לחיצה על מחוץ לתפריט
        const handleClickOutside = (e) => {
            if (menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !e.target.closest(".openLinksButton")) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchName(value);

        if (value && value.length >= 1) {
            try {
                const res = await getUsersByValue(value);
                setSuggestions(res.data);
            } catch (err) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="navbar_page">
            <div className="navbar_left">
                <NavLink to="/feed" className="logo_nav-link">
                    <img src={logo} alt="לוגו" className="logo" />
                </NavLink>
            </div>

            {/* קישורים לתצוגת מחשב */}
            <div className="navbar_center">
                <div className="links_list">
                    <NavLink to="/contact" className={`nav-link ${isContactPage ? "active" : ""}`}>
                        <div className="nav-item">
                            <img src={contact} width={20} height={20} alt="צור קשר" />
                            <span>פניות</span>
                        </div>
                    </NavLink>
                    <NavLink to="/board" className={`nav-link ${isBoardPage ? "active" : ""}`}>
                        <div className="nav-item">
                            <img src={leader_board} width={30} height={30} id="boardLink" alt="לוח" />
                            <span>לוח</span>
                        </div>
                    </NavLink>
                    <NavLink to="/notifications" className={`nav-link ${isNotificationsPage ? "active" : ""}`}>
                        <div className="nav-item">
                            <div className="notif-icon-container">
                                <img src={notification} width={20} height={20} alt="התראות" />
                                {notificationsCount > 0 && <span className="notif-badge">{notificationsCount}</span>}
                            </div>
                            <span>התראות</span>
                        </div>
                    </NavLink>
                    <NavLink to={`/profile/${user.userId}`} className={`nav-link ${isProfilePage ? "active" : ""}`}>
                        <div className="nav-item">
                            <img src={profile} width={20} height={20} alt="פרופיל" />
                            <span>פרופיל</span>
                        </div>
                    </NavLink>
                    <NavLink to="/feed" className={`nav-link ${isFeedPage ? "active" : ""}`}>
                        <div className="nav-item">
                            <img src={home} width={20} height={20} alt="עמוד הבית" />
                            <span>בית</span>
                        </div>
                    </NavLink>
                    <NavLink to="/login" className="nav-link">
                        <div className="nav-item" id="guest">
                            {user?.profilePictureUser ? (
                                <img src={user.profilePictureUser} className="avatar-fallback" alt="תמונת פרופיל"/>) :
                                (<div className="avatar-fallback">
                                    {(user?.userName || 'אורח').charAt(0).toUpperCase()}
                                </div>)}
                        </div>
                    </NavLink>
                </div>
            </div>

            {/* קישורים לתצוגת מובייל */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`} ref={menuRef}>

                <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item" id="guest">
                        {user?.profilePictureUser ? (
                            <img src={user.profilePictureUser} className="avatar-fallback" alt="תמונת פרופיל"/>
                        ) : (
                            <div className="avatar-fallback">
                                {(user?.userName || 'אורח').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </NavLink>
                <NavLink to="/feed" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item">
                        <img src={home} width={20} height={20} alt="עמוד הבית" />
                        <span>בית</span>
                    </div>
                </NavLink>
                <NavLink to={`/profile/${user.userId}`} className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item">
                        <img src={profile} width={20} height={20} alt="פרופיל" />
                        <span>פרופיל</span>
                    </div>
                </NavLink>
                <NavLink to="/notifications" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item">
                        <div className="notif-icon-container">
                            <img src={notification} width={20} height={20} alt="התראות" />
                            {notificationsCount > 0 && <span className="notif-badge">{notificationsCount}</span>}
                        </div>
                        <span>התראות</span>
                    </div>
                </NavLink>
                <NavLink to="/board" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item">
                        <img src={leader_board} width={20} height={20} alt="לוח" />
                        <span>לוח</span>
                    </div>
                </NavLink>
                <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <div className="nav-item" id="contactLinkInNavbar">
                        <img src={contact} width={20} height={20} alt="צור קשר" />
                        <span>צור קשר</span>
                    </div>
                </NavLink>

                <div className="nav-link" >
                    <div className="nav-item">
                        <div className="search-container" id="search-container_in_mobile">
                            <i
                                className="fas fa-search search-icon-in-mobile"
                                onClick={() => handleSearchChange({ target: { value: searchName } })}
                                tabIndex="0"
                            />
                            <input
                                type="text"
                                className="search_in_navbar_in_mobile"
                                placeholder="חיפוש משתמש"
                                value={searchName}
                                onChange={handleSearchChange}
                            />
                            {suggestions.length > 0 && (
                                <ul className="search-suggestions">
                                    {suggestions.map((user) => (
                                        <li
                                            key={user.userId}
                                            onClick={() => {
                                                setSearchName(user.userName);
                                                setSuggestions([]);
                                                setSearchName("");
                                                window.location.href = `/profile/${user._id}`;
                                            }}
                                        >
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} className="userUrlInSearchField" alt="תמונת פרופיל"/>
                                            ) : (
                                                <div className="avatar-fallback" id="avatar-fallback_navbar">
                                                    {(user.userName || 'אורח').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            {user.userName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="navbar_right">
                <div className="search-container">
                    <i
                        className="fas fa-search search-icon"
                        onClick={() => handleSearchChange({ target: { value: searchName } })}
                        tabIndex="0"
                    />
                    <input
                        type="text"
                        className="search_in_navbar"
                        placeholder="חיפוש משתמש"
                        value={searchName}
                        onChange={handleSearchChange}
                    />
                    {suggestions.length > 0 && (
                        <ul className="search-suggestions">
                            {suggestions.map((user) => (
                                <li
                                    key={user.userId}
                                    onClick={() => {
                                        setSearchName(user.userName);
                                        setSuggestions([]);
                                        setSearchName("");
                                        window.location.href = `/profile/${user._id}`;
                                    }}
                                >
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} className="userUrlInSearchField" alt="תמונת פרופיל" />
                                    ) : (
                                        <div className="avatar-fallback" id="avatar-fallback_navbar">
                                            {(user.userName || 'אורח').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {user.userName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <button
                className={`openLinksButton ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <FaBars />
            </button>
        </div>
    );
};

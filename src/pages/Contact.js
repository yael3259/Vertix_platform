import { useState } from "react";
import '../styles/Contact.css';
import contact_background from "../files/contact_background.jpg";



export const Contact = () => {
    const [statusMsg, setStatusMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("access_key", "f7ece38d-e615-48f5-bf11-28b71eccb1af");

        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                setStatusMsg("הטופס נשלח בהצלחה!");
                e.target.reset();
            } else {
                setStatusMsg("השליחה נכשלה. נסה שוב.");
            }
        } catch (error) {
            console.error(error);
            setStatusMsg("שגיאה בשליחה.");
        }
    };

    return (
        <div className="contact-container">
            <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="contact-title">👋🏼 אנחנו כאן לכל שאלה</h2>
                <p className="contact-subtext">יש לכם שאלה, בקשה או משהו שחשוב לדווח? אל תהססו לפנות אלינו! צוות Vertix כאן כדי להקשיב, לעזור ולהתייחס לכל פנייה :)</p>
                <div className="contact-input-group">
                    <label htmlFor="name" className="contact-label">שם</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="contact-input"
                        placeholder="הכנס את שמך"
                        required
                    />
                </div>

                <div className="contact-input-group">
                    <label htmlFor="email" className="contact-label">אימייל</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="contact-input"
                        placeholder="הכנס את האימייל שלך"
                        required
                    />
                </div>

                <div className="contact-input-group">
                    <label htmlFor="message" className="contact-label">הודעה</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        className="contact-textarea"
                        placeholder="כתוב כאן את ההודעה שלך"
                        required
                    />
                </div>

                <button type="submit" className="contact-submit-btn">
                    שלח
                </button>

                {statusMsg && <p className="contact-status">{statusMsg}</p>}
            </form>
        </div>
    );
};
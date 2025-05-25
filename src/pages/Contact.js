import React, { useState } from 'react';
import '../styles/Contact.css';



export const Contact = () => {
    const [status, setStatus] = useState('');

    
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append("access_key", "f7ece38d-e615-48f5-bf11-28b71eccb1af");

        const object = Object.fromEntries(formData.entries());
        const json = JSON.stringify(object);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            });

            const result = await res.json();

            if (result.success) {
                setStatus("הטופס נשלח בהצלחה!");
                event.target.reset();
            } else {
                setStatus("השליחה נכשלה. נסה שוב.");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("שגיאה בשליחה.");
        }
    };

    return (
        <div className="contact-page">
            <form className="contact-form" onSubmit={onSubmit}>
                <label htmlFor="name">שם</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">אימייל</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="message">הודעה</label>
                <textarea id="message" name="message" rows="5" required></textarea>

                <button type="submit">שלח</button>

                {status && <p className="status-message">{status}</p>}
            </form>
        </div>
    );
};

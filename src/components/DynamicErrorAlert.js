import { useEffect, useState } from "react";
import "../styles/DynamicErrorAlert.css";



export const DynamicErrorAlert = ({ errorText }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!errorText) return;

        setVisible(true);

        const timeout = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [errorText]);

    if (!visible) return null;

    return (
        <div className="DynamicErrorAlert">
            {errorText}
        </div>
    );
};
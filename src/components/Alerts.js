import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Alerts.css"


export const successAlert = (text) => {
    toast.success(
        <div style={{ width: "100%", textAlign: "center" }}>
            {text}
        </div>
    );
};


export const faildAlert = (text) => {
    toast.error(
        <div style={{ width: "100%", textAlign: "center" }}>
            {text}
        </div>
    );
};


export const warningAlert = (text) => {
    toast.warning(
        <div style={{ width: "100%", textAlign: "center" }}>
            {text}
        </div>
    );
};
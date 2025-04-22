import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const successAlert = (text) => {
    toast.success(
        <div className="toast">
            {text}
        </div>
    );
};


export const faildAlert = (text) => {
    toast.error(
        <div className="toast">
            {text}
        </div>
    );
};


export const warningAlert = (text) => {
    toast.warning(
        <div className="toast">
            {text}
        </div>
    );
};
import axios from "axios";



let url = process.env.PYTHON_SERVER_URL;
// let url = "https://python-analytics.vercel.app/api";


export const get_overview_data = () => {
    return axios.get(`${url}/overview`);
}

export const get_administrators = () => {
    return axios.get(`${url}/admins-info`);
}

export const get_signups_last_six_months = () => {
    return axios.get(`${url}/signups-overview`);
}
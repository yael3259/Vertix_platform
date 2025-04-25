import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/achievement` || "http://localhost:5000/domain/api/achievement";



export const getAllAchievements = () => {
    return axios.get(baseURL);
}

export const addAchievement = (achievement) => {
    return axios.post(baseURL, achievement);
}

export const getUserAchievements = (userId) => {
    return axios.get(`${baseURL}/${userId}`);
}

export const updateTrackingTable = (achievementId) => {
    return axios.put(`${baseURL}/${achievementId}`);
}

export const createTrackingTable = (dates) => {
    return axios.post(`${baseURL}/table`, dates);
}
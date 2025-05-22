import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/achievement` || "http://localhost:5000/domain/api/achievement";



export const getAllAchievements = () => {
    return axios.get(baseURL);
}

export const addAchievement = (achievement, token) => {
    return axios.post(baseURL, achievement, { headers: { "x-access-token": token } });
}

export const getUserAchievements = (userId) => {
    return axios.get(`${baseURL}/achievements/${userId}`);
}

export const updateTrackingTable = (achievementId, isMarkedToday) => {
    return axios.put(`${baseURL}/${achievementId}`, {isMarkedToday});
}

export const getAchievementByUser = (token, achievementId) => {
    return axios.get(`${baseURL}/table/${achievementId}`, { headers: { "x-access-token": token } });
}
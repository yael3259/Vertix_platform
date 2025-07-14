import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/achievement` || "http://localhost:5000/domain/api/achievement";



export const getAllAchievements = () => {
    return axios.get(baseURL);
}

export const addAchievement = (achievement, token) => {
    return axios.post(baseURL, achievement, { headers: { "x-access-token": token } });
}

export const addBoost = (boost, token) => {
    return axios.post(`${baseURL}/boost`, boost, { headers: { "x-access-token": token } });
}

export const getUserAchievements = (userId) => {
    return axios.get(`${baseURL}/achievements/${userId}`);
}

export const getUserBoosts = (userId) => {
    return axios.get(`${baseURL}/boosts/${userId}`);
}

export const updateTrackingTableAchievement = (achievementId, isMarkedToday) => {
    return axios.put(`${baseURL}/updateAchievement/${achievementId}`, {isMarkedToday});
}

export const updateTrackingTableBoost = (boostId, isMarkedToday) => {
    return axios.put(`${baseURL}/updateBoost/${boostId}`, {isMarkedToday});
}

export const getAchievementByUser = (token, achievementId) => {
    return axios.get(`${baseURL}/table/${achievementId}`, { headers: { "x-access-token": token } });
}

export const getBoostByUser = (token, boostId) => {
    return axios.get(`${baseURL}/boost/${boostId}`, { headers: { "x-access-token": token } });
}
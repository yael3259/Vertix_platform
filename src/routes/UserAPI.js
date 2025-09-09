import axios from "axios";



let baseURL = `${process.env.REACT_APP_BASE_URL}/user` || "http://localhost:5000/domain/api/user";



export const getAllUsers = () => {
    return axios.get(baseURL);
}

export const getOneUser = (userId) => {
    return axios.get(`${baseURL}/${userId}`)
}

export const getUsersByValue = (value) => {
    return axios.get(`${baseURL}/getUsersWithSameLetters?value=${encodeURIComponent(value)}`);
}

export const usersDisplayInTable = () => {
    return axios.get(`${baseURL}/tableDisplay`);
}

export const addUser = (user) => {
    return axios.post(baseURL, user);
}

export const login = (user) => {
    return axios.post(`${baseURL}/login`, user);
}

export const deleteUser = (userId) => {
    return axios.delete(`${baseURL}/${userId}`);
}

export const log_outUser = (userId) => {
    return axios.put(`${baseURL}/log_out/${userId}`);
}

export const resetPasswordUser = (data) => {
    return axios.put(baseURL, data);
}

export const getRandomUsers = () => {
    return axios.get(`${baseURL}/random`);
}

export const AddFriendToNetwork = (userId, idOfFriend, token) => {
    return axios.post(`${baseURL}/network/${userId}`, { friendId: idOfFriend }, { headers: { "x-access-token": token } });
}

export const removeFriendFromNetwork = (userId, idOfFriend) => {
    return axios.delete(`${baseURL}/removeNetwork/${userId}`, { data: { friendId: idOfFriend } });
}

export const getFollowing = (userId) => {
    return axios.get(`${baseURL}/following/${userId}`);
}

export const getNotificationsByUser = (userId) => {
    return axios.get(`${baseURL}/notification/${userId}`);
}

export const markNotificationsAsRead = (userId) => {
    return axios.put(`${baseURL}/markNotifications/${userId}`);
}

export const updateUserPoints = (userId, points) => {
    console.log("react: ", userId, points);
    return axios.put(`${baseURL}/updatePoints/${userId}`, { pointsToAdd: points });
}

export const editUserDetails = (userId, data) => {
    return axios.put(`${baseURL}/update/${userId}`, data);
}

export const updateUserSkills = (userId, data) => {
    return axios.put(`${baseURL}/skills/${userId}`, data);
}
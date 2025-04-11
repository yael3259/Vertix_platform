import axios from "axios";



let baseURL = `${process.env.REACT_APP_BASE_URL}/user` || "http://localhost:5000/domain/api/user";



export const getAllUsers = () => {
    return axios.get(baseURL);
}

export const addUser = (user) => {
    return axios.post(baseURL, user);
}

export const login = (user) => {
    return axios.post(baseURL, user);
}

export const deleteUser = (userId) => {
    return axios.delete(`${baseURL}/${userId}`);
}

export const log_outUser = (userId) => {
    return axios.delete(`${baseURL}/${userId}`);
}

export const resetPasswordUser = (data) => {
    return axios.put(baseURL, data);
}

export const updateUserDetails = (user) => {
    return axios.put(`${baseURL}/${user.id}`, user);
}
export const getRandomUsers = () => {
    return axios.get(`${baseURL}/random`);
}
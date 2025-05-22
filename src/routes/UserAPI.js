import axios from "axios";



let baseURL = `${process.env.REACT_APP_BASE_URL}/user` || "http://localhost:5000/domain/api/user";



export const getAllUsers = () => {
    return axios.get(baseURL);
}

export const getOneUser = (userId) => {
    return axios.get(`${baseURL}/${userId}`)
}

export const addUser = (user) => {
    return axios.post(baseURL, user);
}

export const login = (user) => {
    console.log(user)
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

export const updateUserDetails = (userId, data) => {
    console.log("data: ", data, "userID: ", userId);
    return axios.put(`${baseURL}/update/${userId}`, data);
}

export const getRandomUsers = () => {
    return axios.get(`${baseURL}/random`);
}
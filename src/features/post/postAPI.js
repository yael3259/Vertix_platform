import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/post` || "http://localhost:5000/domain/api/post";



export const getAllPosts = () => {
    return axios.get(baseURL);
}

export const getPostById = (id) => {
    return axios.get(`${baseURL}/${id}`);
}

export const addPost = (post) => {
    return axios.post(baseURL, post);
}

export const deletePost = (id) => {
    return axios.delete(`${baseURL}/${id}`);
}

// export const toggleLikePost = (postId, userId) => {
//     return axios.post(`${baseURL}${postId}`, {userId});
// }

export const addComment = (comment, postId) => {
    return axios.post(`${baseURL}/comment/${postId}`, comment);
}

export const getCommentOfPostById = (postId) => {
    return axios.get(`${baseURL}/comments/${postId}`);
}
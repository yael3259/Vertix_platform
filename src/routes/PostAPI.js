import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/post` || "http://localhost:5000/domain/api/post";



export const getAllPosts = (page, limit) => {
    return axios.get(`${baseURL}?page=${page}&limit=${limit}`);
};

export const getPostsById = (userId) => {
    return axios.get(`${baseURL}/${userId}`);
};

export const getPostById = (postId) => {
    return axios.get(`${baseURL}/singlePost/${postId}`);
};

export const addPost = (post, token) => {
    return axios.post(baseURL, post, { headers: { "x-access-token": token } });
}

export const editPost = (postId) => {
    return axios.put(`${baseURL}/${postId}`);
}

export const deletePost = (postId) => {
    return axios.delete(`${baseURL}/${postId}`);
}

export const toggleLikePost = (userId, postId) => {
    return axios.post(`${baseURL}/like/${userId}`, { postId });
}

export const addComment = (postId, text, userId) => {
    return axios.post(`${baseURL}/comment/${postId}`, { text, userId });
}

export const getCommentOfPostById = (postId) => {
    return axios.get(`${baseURL}/comments/${postId}`);
}

export const addToFavoritePosts = (postId, userId) => {
    return axios.post(`${baseURL}/favorites/${userId}`, { postId });
}

export const getFavoritePosts = (userId) => {
    return axios.get(`${baseURL}/getFavorites/${userId}`,);
}
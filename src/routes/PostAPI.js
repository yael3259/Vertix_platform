import axios from "axios";




let baseURL = `${process.env.REACT_APP_BASE_URL}/post` || "http://localhost:5000/domain/api/post";



export const getAllPosts = (page, limit, searchText = '') => {
    return axios.get(`${baseURL}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchText)}`);
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

export const deletePost = (id) => {
    return axios.delete(`${baseURL}/${id}`);
}

// export const toggleLikePost = (postId, userId) => {
//     return axios.post(`${baseURL}${postId}`, {userId});
// }

export const addComment = (postId, text, userId) => {
    console.log('postId: ', postId);
    console.log('comment: ', text);
    return axios.post(`${baseURL}/comment/${postId}`, { text, userId });
}

export const getCommentOfPostById = (postId) => {
    return axios.get(`${baseURL}/comments/${postId}`);
}
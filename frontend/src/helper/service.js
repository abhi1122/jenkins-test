const axios = require("axios");

axios.defaults.baseURL = 'http://localhost:3003';
axios.defaults.headers.common['Authorization'] = 'Bearer 5d9jwgzx3NvMOdzcbsBPJO9LVg1yF8bZ';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const get = async ({
    url
}) => {
    return axios
        .get(url);
}

const post = async ({
    url,
    data
}) => {
    return axios.post(url, data);
}

export {
    get,
    post
};
const axios = require("axios");
console.log(process.env,'env variable urlll')
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_API_KEY}`;
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

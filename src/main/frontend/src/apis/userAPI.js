import axios from "axios";
import Cookies from "universal-cookie";

export const getToken = () => {
    const cookies = new Cookies();
    return cookies.get("token");
};

export const createUserAPI = (userDetails) => {
    return axios.post(
        process.env.REACT_APP_BASE_URL + "/account/register/",
        userDetails
    );
};

export const authUserAPI = (userDetails) => {
    return axios.post(
        process.env.REACT_APP_BASE_URL + "/account/auth/",
        userDetails
    );
};

export const getUserAPI = () => {
    return axios.get(process.env.REACT_APP_BASE_URL + "/user/", {
        headers: {
            Authorization: getToken(),
        },
    });
};

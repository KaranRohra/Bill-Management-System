import axios from "axios";
import { getToken } from "apis/userAPI";

export const createBillAPI = (bill) => {
    return axios.post(process.env.REACT_APP_BASE_URL + "/bills/", bill, {
        headers: {
            Authorization: getToken(),
        },
    });
};

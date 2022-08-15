import axios from "axios";
import { getToken } from "apis/userAPI";

export const createBillAPI = (bill) => {
    return axios.post(process.env.REACT_APP_BASE_URL + "/bills/", bill, {
        headers: {
            Authorization: getToken(),
        },
    });
};

export const getBillsAPI = () => {
    return axios.get(process.env.REACT_APP_BASE_URL + "/bills/", {
        headers: {
            Authorization: getToken(),
        },
    });
};

export const deleteBillAPI = (billId) => {
    return axios.delete(process.env.REACT_APP_BASE_URL + "/bills/" + billId, {
        headers: {
            Authorization: getToken(),
        },
    });
};

export const updateBillAPI = (billDetails, billId) => {
    return axios.put(
        process.env.REACT_APP_BASE_URL + "/bills/" + billId,
        billDetails,
        {
            headers: {
                Authorization: getToken(),
            },
        }
    );
};

import axios from "axios";
import { getToken } from "apis/userAPI";

export const createBillAPI = (bill) => {
    return axios.post(process.env.REACT_APP_BASE_URL + "/bills/", bill, {
        headers: {
            Authorization: getToken(),
        },
    });
};

export const getBillsAPI = (filter) => {
    return axios.get(
        process.env.REACT_APP_BASE_URL +
            `/bills/?sortBy=${filter.sortBy}&` + 
            `search=${filter.search}&` + 
            `dateGreaterThan=${filter.dateGreaterThan}&dateLessThan=${filter.dateLessThan}&` + 
            `amountGreaterThan=${filter.amountGreaterThan}&amountLessThan=${filter.amountLessThan}`,
        {
            headers: {
                Authorization: getToken(),
            },
        }
    );
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

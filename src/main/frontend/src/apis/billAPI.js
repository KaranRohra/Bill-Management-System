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
    let url = process.env.REACT_APP_BASE_URL + "/bills/?";
    if (filter.sortBy) url += `sortBy=${filter.sortBy}&`;
    if (filter.search) url += `search=${filter.search}&`;
    if (filter.billPaid) url += `billPaid=${filter.billPaid}&`;
    if (filter.dateGreaterThan)
        url += `dateGreaterThan=${filter.dateGreaterThan}&`;
    if (filter.dateLessThan) url += `dateLessThan=${filter.dateLessThan}&`;
    if (filter.amountGreaterThan)
        url += `amountGreaterThan=${filter.amountGreaterThan}&`;
    if (filter.amountLessThan)
        url += `amountLessThan=${filter.amountLessThan}&`;
    if(filter.billPaid) url += `billPaid=${filter.billPaid}`;
    return axios.get(url, {
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

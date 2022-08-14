package com.backend.utility;

public interface Links {
    String BASE_URL = "/api/v1/";

    // User URLs
    String AUTH_URL = BASE_URL + "account/auth/";
    String REGISTER_URL = BASE_URL + "account/register/";
    String GET_USER_URL = BASE_URL + "user/";
    String UPDATE_USER_URL = BASE_URL + "user/";

    // Bill URLs
    String GET_ALL_BILLS = BASE_URL + "bills/";
    String GET_BILL_BY_ID = BASE_URL + "bills/{id}";
    String CREATE_BILL = BASE_URL + "bills/";
    String UPDATE_BILL = BASE_URL + "bills/{id}";
    String DELETE_BILL = BASE_URL + "bills/{id}";
}

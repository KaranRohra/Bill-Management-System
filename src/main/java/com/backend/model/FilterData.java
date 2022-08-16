package com.backend.model;

import lombok.Data;

@Data
public class FilterData {
    private String search;
    private String sortBy;
    private String dateGreaterThan;
    private String dateLessThan;
    private Long amountGreaterThan;
    private Long amountLessThan;
}

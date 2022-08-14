package com.backend.mapstruct.dto;

import lombok.Data;

@Data
public class BillDto { // DTO -> Data Transfer Object

    private String billerName;

    private String billerEmail;

    private String phoneNo;

    private String description;

    private Long amount;

    private Long amountPaid;

    private boolean isBillPaid;

}

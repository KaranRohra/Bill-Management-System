package com.backend.mapstruct.dto;

import lombok.Data;

@Data
public class UserDto {
    private String name;

    private String email;

    private String phoneNo;

    private String password;
}

package com.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnauthorizedUserException extends RuntimeException{
    public UnauthorizedUserException(String message) {
        super(message);
    }
}

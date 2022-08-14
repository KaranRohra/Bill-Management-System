package com.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class AccountWithEmailAlreadyExistException extends RuntimeException {
    public AccountWithEmailAlreadyExistException(String message) {
        super(message);
    }
}

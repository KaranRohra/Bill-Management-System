package com.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UploadDownloadFileException extends RuntimeException {
    public UploadDownloadFileException(String message) {
        super(message);
    }
}

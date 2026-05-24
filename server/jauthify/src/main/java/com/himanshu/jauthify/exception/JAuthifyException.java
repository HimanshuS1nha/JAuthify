package com.himanshu.jauthify.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class JAuthifyException extends Exception {
    private HttpStatus code;

    public JAuthifyException(String message, HttpStatus code) {
        super(message);
        this.code = code;
    }

}

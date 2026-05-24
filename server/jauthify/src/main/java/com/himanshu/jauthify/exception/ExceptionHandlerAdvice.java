package com.himanshu.jauthify.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.himanshu.jauthify.dto.MessageResponse;

@RestControllerAdvice
public class ExceptionHandlerAdvice {
    @ExceptionHandler
    public ResponseEntity<MessageResponse> jauthifyExceptionHandler(JAuthifyException exception) {
        return new ResponseEntity<>(new MessageResponse(exception.getMessage()), exception.getCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> methodArgumentNotValidExceptionHandler(
            MethodArgumentNotValidException exception) {
        String message = exception.getAllErrors().stream().map(err -> err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return new ResponseEntity<>(new MessageResponse(message), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> exceptionHandler(Exception exception) {
        return new ResponseEntity<>(new MessageResponse("Some error occurred. Please try again later!"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

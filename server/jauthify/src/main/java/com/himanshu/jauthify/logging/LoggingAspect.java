package com.himanshu.jauthify.logging;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {
    private static Log LOGGER = LogFactory.getLog(LoggingAspect.class);

    @AfterThrowing(pointcut = "execution(* com.himanshu.jauthify.service.impl.*.*(..))")
    public void logServiceLevelException(Exception exception) {
        LOGGER.error(exception.getMessage(), exception);
    }
}

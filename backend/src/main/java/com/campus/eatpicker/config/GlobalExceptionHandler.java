package com.campus.eatpicker.config;

import com.campus.eatpicker.common.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理
 *
 * 将所有 RuntimeException 转换为友好的 JSON 响应，
 * 避免 Tomcat 默认的 500 错误页暴露给前端。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntime(RuntimeException e) {
        return Result.error(400, e.getMessage());
    }
}

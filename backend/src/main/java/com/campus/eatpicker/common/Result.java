package com.campus.eatpicker.common;

import lombok.Data;

/**
 * 统一响应体
 *
 * 全站 API 统一返回格式：code=0 表示成功，非 0 表示业务异常。
 * 前端 api.js 根据 code 字段判断是否抛出异常。
 */
@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = 0;
        r.message = "ok";
        r.data = data;
        return r;
    }

    public static <T> Result<T> error(int code, String message) {
        Result<T> r = new Result<>();
        r.code = code;
        r.message = message;
        return r;
    }
}

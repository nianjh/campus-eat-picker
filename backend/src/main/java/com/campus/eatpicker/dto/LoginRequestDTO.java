package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 登录请求 DTO
 */
@Data
public class LoginRequestDTO {
    private String studentId;       // 学号
    private String password;        // 密码
}

package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 注册请求 DTO
 *
 * 传统注册入口：学号 + 密码 + 可选花名。
 * 学号规则：10 位数字，如 2023212099。
 */
@Data
public class RegisterRequestDTO {
    private String studentId;       // 学号（10位数字）
    private String password;        // 密码（最少6位）
    private String nickname;        // 花名（可选，不填则随机生成）
}

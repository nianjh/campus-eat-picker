package com.campus.eatpicker.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 认证结果 DTO
 *
 * 一键投胎或登录成功后返回给前端的身份信息。
 * userRole 字段供前端判断是否显示管理后台入口。
 */
@Data
@Builder
public class AuthResultDTO {
    private Long userId;
    private String nickname;
    private String userRole;         // STUDENT / ADMIN（JWT payload + 前端菜单判断）
    private String avatarUrl;
    private String token;            // JWT Token

    /**
     * 返回给前端的入场文案（每次投胎随机挑选一句，增加仪式感）
     */
    private String welcomeMessage;
}

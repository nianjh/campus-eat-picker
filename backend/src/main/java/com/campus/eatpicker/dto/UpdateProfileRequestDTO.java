package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 更新个人资料请求 DTO
 */
@Data
public class UpdateProfileRequestDTO {
    private String studentId;         // 绑定学号（可选，仅未绑定用户可用）
    private String nickname;          // 新花名（可选）
    private String currentPassword;   // 当前密码（改密码时必填）
    private String newPassword;       // 新密码（可选）
}

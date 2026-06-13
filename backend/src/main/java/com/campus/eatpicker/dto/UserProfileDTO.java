package com.campus.eatpicker.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

/**
 * 用户个人主页响应 DTO
 */
@Data
@Builder
public class UserProfileDTO {
    private Long userId;
    private String nickname;
    private String studentId;
    private String userRole;
    private String avatarUrl;
    private String accountStatus;
    private Date lastLoginTime;
    private Date createTime;
}

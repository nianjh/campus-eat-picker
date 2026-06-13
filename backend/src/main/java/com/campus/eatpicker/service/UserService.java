package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;
import com.campus.eatpicker.dto.RegisterRequestDTO;
import com.campus.eatpicker.dto.UpdateProfileRequestDTO;
import com.campus.eatpicker.dto.UserProfileDTO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 一键投胎：随机生成花名 + 写入用户表 + 返回身份信息
     */
    AuthResultDTO quickRegister();

    /**
     * 传统注册：学号 + 密码 + 可选花名
     */
    AuthResultDTO register(RegisterRequestDTO request);

    /**
     * 传统登录：学号 + 密码验证
     */
    AuthResultDTO login(LoginRequestDTO request);

    /**
     * 获取个人主页信息
     */
    UserProfileDTO getProfile(Long userId);

    /**
     * 更新个人资料（花名 / 密码）
     */
    UserProfileDTO updateProfile(Long userId, UpdateProfileRequestDTO request);
}

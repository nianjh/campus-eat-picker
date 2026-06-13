package com.campus.eatpicker.controller;

import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.dto.UpdateProfileRequestDTO;
import com.campus.eatpicker.dto.UserProfileDTO;
import com.campus.eatpicker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户个人主页控制器
 *
 * 提供两个入口（均需 JWT 登录态）：
 * - GET  /api/user/profile  ：获取当前用户个人主页信息
 * - PUT  /api/user/profile  ：更新花名 / 修改密码
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取当前登录用户的个人主页
     */
    @GetMapping("/profile")
    public Result<UserProfileDTO> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserProfileDTO profile = userService.getProfile(userId);
        return Result.success(profile);
    }

    /**
     * 更新个人资料（花名 / 密码）
     */
    @PutMapping("/profile")
    public Result<UserProfileDTO> updateProfile(@RequestBody UpdateProfileRequestDTO body,
                                                 HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserProfileDTO profile = userService.updateProfile(userId, body);
        return Result.success(profile);
    }
}

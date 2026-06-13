package com.campus.eatpicker.controller;

import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;
import com.campus.eatpicker.dto.RegisterRequestDTO;
import com.campus.eatpicker.service.UserService;
import com.campus.eatpicker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户认证控制器
 *
 * 提供三个入口：
 * - POST /api/auth/quick-register ：一键投胎（免密注册即登录）
 * - POST /api/auth/register       ：传统注册（学号 + 密码 + 可选花名）
 * - POST /api/auth/login          ：传统学号+密码登录
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * 🎲 一键投胎 —— 无需手机号、无需邮箱、无需学号
     *
     * 后端从花名词库随机抽取形容词 + 食物名拼成唯一花名，
     * 写入 DB 后用 IDENTITY 自增主键作为 userId，返回 JWT。
     *
     * 调用即注册，注册即登录。拒绝一切繁琐流程。
     */
    @PostMapping("/quick-register")
    public Result<AuthResultDTO> quickRegister() {
        // 1. 随机生成花名 + 写入数据库
        AuthResultDTO result = userService.quickRegister();
        // 2. 签发 JWT（含 userId, nickname, userRole）
        String token = jwtUtil.generateToken(result.getUserId(), result.getNickname(), result.getUserRole());
        result.setToken(token);
        return Result.success(result);
    }

    /**
     * 📝 正经注册 —— 学号 + 密码 + 可选花名
     *
     * 适合想绑定真实学号的体面人。
     * 学号规则：10位数字，如 2023212099。
     * 花名不填则自动从词库随机生成。
     */
    @PostMapping("/register")
    public Result<AuthResultDTO> register(@RequestBody RegisterRequestDTO request) {
        AuthResultDTO result = userService.register(request);
        String token = jwtUtil.generateToken(result.getUserId(), result.getNickname(), result.getUserRole());
        result.setToken(token);
        return Result.success(result);
    }

    /**
     * 📖 老怨种回归 —— 传统学号+密码登录
     *
     * 适用于绑定了学号的老用户，或者想正经登录的体面人。
     */
    @PostMapping("/login")
    public Result<AuthResultDTO> login(@RequestBody LoginRequestDTO request) {
        AuthResultDTO result = userService.login(request);
        // 签发 JWT（含 userId, nickname, userRole）
        String token = jwtUtil.generateToken(result.getUserId(), result.getNickname(), result.getUserRole());
        result.setToken(token);
        return Result.success(result);
    }
}

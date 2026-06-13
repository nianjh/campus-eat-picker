package com.campus.eatpicker.config;

import com.campus.eatpicker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT 身份认证拦截器 —— 双层拦截器网关第一层
 *
 * 从请求头 Authorization: Bearer <token> 中提取 JWT 并校验。
 * 解析失败或缺失 Token 一律返回 401。
 * 校验通过后将 userId、nickname、userRole 写入 request attribute
 * 供下游 AdminInterceptor 做 RBAC。
 *
 * 注意：放行 OPTIONS 预检请求（CORS 依赖）。
 */
@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        // 放行 OPTIONS 预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(401);
            return false;
        }

        // 将 userId、nickname、userRole 写入 request attribute
        request.setAttribute("userId", jwtUtil.getUserId(token));
        request.setAttribute("nickname", jwtUtil.getNickname(token));
        request.setAttribute("userRole", jwtUtil.getUserRole(token));
        return true;
    }
}

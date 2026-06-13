package com.campus.eatpicker.config;

import com.campus.eatpicker.common.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 管理员权限拦截器 —— 双层拦截器网关第二层
 *
 * 在 JwtInterceptor 已完成身份认证的基础上，
 * 校验 request attribute 中 userRole 是否为 ADMIN。
 * 非管理员访问 /api/admin/** 一律返回 403 JSON。
 */
@Component
@RequiredArgsConstructor
public class AdminInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws IOException {
        String userRole = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(userRole)) {
            response.setStatus(403);
            response.setContentType("application/json;charset=UTF-8");
            Result<Void> error = Result.error(403,
                    "权限不足：本接口仅对食堂管理员开放。请联系超级管理员，手动执行 UPDATE T_APP_USER SET USER_ROLE='ADMIN' WHERE ID=你的ID 升权。");
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return false;
        }
        return true;
    }
}

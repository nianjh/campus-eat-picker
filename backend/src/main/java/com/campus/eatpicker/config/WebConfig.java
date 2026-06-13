package com.campus.eatpicker.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web 配置 —— 双层拦截器注册 + 全局 CORS 跨域盾牌
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;
    private final AdminInterceptor adminInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 第一层：JWT 身份认证（放行投胎/登录/转盘）
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/quick-register",
                        "/api/auth/register",
                        "/api/auth/login",
                        "/api/wheel/spin"
                );

        // 第二层：管理员 RBAC（仅拦截 /api/admin/**）
        registry.addInterceptor(adminInterceptor)
                .addPathPatterns("/api/admin/**");
    }

    /**
     * 全局 CORS 跨域盾牌 —— 支持前后端多端口分离联调
     *
     * 允许所有来源（开发/生产多域名场景），开放全部 HTTP 方法，
     * 显式暴露 Authorization 头（JWT 透传依赖），预检缓存 1 小时
     * 以大幅降低 OPTIONS 预检请求对达梦底座造成的并发 QPS 损耗。
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

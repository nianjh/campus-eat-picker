package com.campus.eatpicker.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 令牌工具类
 *
 * 负责 Token 的生成、校验、解析，以及从 Claims 中安全提取用户身份信息。
 * 所有提取方法均采用 "Object 接收 → null 校验 → .toString() 安全转换" 模式，
 * 彻底消除高并发下脏 Claims 导致的 ClassCastException 与空指针异常。
 */
@Component
public class JwtUtil {

    // 生产环境请从配置中心拉取，不要硬编码在代码里
    private static final String SECRET = "WhatToEatWheel2024CampusSecretKey_HopeYouEatWell";
    private static final long EXPIRE_MS = 1000L * 60 * 60 * 24 * 7; // 7 天过期

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * 生成 JWT Token
     * @param userId   用户 ID
     * @param nickname 花名
     * @param userRole 角色（STUDENT/ADMIN，塞进 payload 供 AdminInterceptor 做 RBAC）
     */
    public String generateToken(Long userId, String nickname, String userRole) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("nickname", nickname);
        claims.put("userRole", userRole);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从 Token 中解析 Claims
     */
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 校验 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从 Token 中提取 userId（空值容错 + 类型安全擦除）
     * 高并发反序列化场景下 claims 可能为 null，先取 Object 再安全转换，杜绝 NPE
     */
    public Long getUserId(String token) {
        Object sub = parseToken(token).getSubject();
        return sub != null ? Long.valueOf(sub.toString()) : null;
    }

    /**
     * 从 Token 中提取 nickname（空值容错 + 类型安全擦除）
     * 缺省返回 "匿名食客"，防止脏 claims 导致隐式强转 ClassCastException
     */
    public String getNickname(String token) {
        Object nick = parseToken(token).get("nickname");
        return nick != null ? nick.toString() : "匿名食客";
    }

    /**
     * 从 Token 中提取 userRole（管理员 RBAC 依赖）
     * 空值容错：claims 缺失或类型异常时缺省返回 STUDENT，
     * 彻底消除高并发下 claims.get("userRole") 隐式強转 ClassCastException 与空指针异常
     */
    public String getUserRole(String token) {
        Object role = parseToken(token).get("userRole");
        return role != null ? role.toString() : "STUDENT";
    }
}

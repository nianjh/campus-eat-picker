package com.campus.eatpicker.controller;

import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.dto.SuggestionRequestDTO;
import com.campus.eatpicker.entity.Suggestion;
import com.campus.eatpicker.service.SuggestionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 投稿/意见反馈控制器
 *
 * - POST /api/suggestion  ：用户提交投稿
 * - GET  /api/admin/suggestion        ：管理员查看全部
 * - PUT  /api/admin/suggestion/{id}   ：管理员处理
 * - GET  /api/admin/suggestion/stats  ：统计
 */
@RestController
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    /** 用户提交投稿 */
    @PostMapping("/api/suggestion")
    public Result<Suggestion> submit(@RequestBody SuggestionRequestDTO request,
                                      HttpServletRequest req) {
        Long userId = (Long) req.getAttribute("userId");
        String nickname = (String) req.getAttribute("nickname");
        Suggestion s = suggestionService.submit(userId, nickname, request);
        return Result.success(s);
    }

    /** 管理员查看全部投稿 */
    @GetMapping("/api/admin/suggestion")
    public Result<List<Suggestion>> listAll() {
        return Result.success(suggestionService.listAll());
    }

    /** 管理员处理投稿 */
    @PutMapping("/api/admin/suggestion/{id}")
    public Result<Suggestion> handle(@PathVariable Long id,
                                      @RequestBody Map<String, String> body) {
        Suggestion s = suggestionService.handle(id, body.get("status"), body.get("adminNote"));
        return Result.success(s);
    }

    /** 管理员查看统计 */
    @GetMapping("/api/admin/suggestion/stats")
    public Result<Map<String, Long>> stats() {
        return Result.success(suggestionService.countByType());
    }
}

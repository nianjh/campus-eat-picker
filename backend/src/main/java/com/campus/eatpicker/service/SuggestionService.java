package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.SuggestionRequestDTO;
import com.campus.eatpicker.entity.Suggestion;

import java.util.List;
import java.util.Map;

public interface SuggestionService {
    /** 用户提交投稿 */
    Suggestion submit(Long userId, String nickname, SuggestionRequestDTO request);
    /** 管理员查看全部投稿 */
    List<Suggestion> listAll();
    /** 管理员处理投稿 */
    Suggestion handle(Long id, String status, String adminNote);
    /** 按类型统计 */
    Map<String, Long> countByType();
}

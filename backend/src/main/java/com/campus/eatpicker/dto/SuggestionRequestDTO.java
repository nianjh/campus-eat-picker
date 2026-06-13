package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 用户投稿请求 DTO
 */
@Data
public class SuggestionRequestDTO {
    /** FEEDBACK / SUGGEST / NEW_DISH */
    private String suggType;
    /** 内容（最少5个字符） */
    private String content;
}

package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 发表评论请求 DTO
 */
@Data
public class CommentRequestDTO {
    private Long dishId;
    private Long userId;
    private Integer rating;         // 1-5 星
    private String content;         // 评论正文
    private String commentTags;     // 标签（逗号分隔）
    private Integer isAnonymous;    // 是否匿名：0-否，1-是
}

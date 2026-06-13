package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.CommentRequestDTO;
import com.campus.eatpicker.entity.DishComment;

import java.util.List;

/**
 * 菜品与评论业务服务接口
 */
public interface DishBusinessService {

    /**
     * 发表毒舌评论，并级联更新菜品的平均评分和评论总数
     */
    DishComment postComment(CommentRequestDTO request);

    /**
     * 举报评论 —— 将该评论的 REPORT_COUNT 自增 1
     */
    void reportComment(Long commentId);

    /**
     * 拉取红榜 — Top 10 白月光（AVG_RATING 降序，REVIEW_COUNT > 3）
     */
    List<Object> getRedRanking();

    /**
     * 拉取黑榜 — Top 10 黑暗料理（AVG_RATING 升序，REVIEW_COUNT > 3）
     */
    List<Object> getBlackRanking();
}

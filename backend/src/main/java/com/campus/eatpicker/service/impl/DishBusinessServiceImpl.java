package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.campus.eatpicker.dto.CommentRequestDTO;
import com.campus.eatpicker.entity.CampusDish;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.CampusDishMapper;
import com.campus.eatpicker.mapper.DishCommentMapper;
import com.campus.eatpicker.service.DishBusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

/**
 * 菜品与评论业务服务实现
 *
 * 核心能力：
 * - 发表评论 → 级联刷新菜品 AVG_RATING + REVIEW_COUNT
 * - 举报评论 → REPORT_COUNT 自增
 * - 红/黑榜查询 → Top 10 白月光 / 黑暗料理
 */
@Service
@RequiredArgsConstructor
public class DishBusinessServiceImpl implements DishBusinessService {

    private final DishCommentMapper commentMapper;
    private final CampusDishMapper dishMapper;

    @Override
    @Transactional
    public DishComment postComment(CommentRequestDTO request) {
        // 1. 校验菜品是否存在且为 ACTIVE
        CampusDish dish = dishMapper.selectById(request.getDishId());
        if (dish == null || !"ACTIVE".equals(dish.getDishStatus())) {
            throw new RuntimeException("该菜品已下架或不存在，无法评论。");
        }

        // 2. 写入评论
        DishComment comment = new DishComment();
        comment.setDishId(request.getDishId());
        comment.setUserId(request.getUserId());
        comment.setRating(request.getRating());
        comment.setContent(request.getContent());
        comment.setCommentTags(request.getCommentTags());
        comment.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : 0);
        comment.setLikeCount(0);
        comment.setReportCount(0);
        comment.setCommentStatus("ACTIVE");
        comment.setCreateTime(new Date());
        commentMapper.insert(comment);

        // 3. 级联刷新菜品平均评分与评论总数
        refreshDishRating(dish);

        return comment;
    }

    /**
     * 刷新菜品的平均评分和评论总数
     *
     * 使用 BigDecimal 进行高精度计算，避免浮点数除法截断误差。
     * 只统计状态为 ACTIVE 的评论。
     */
    private void refreshDishRating(CampusDish dish) {
        // 查询该菜品所有活跃评论的评分列表
        LambdaQueryWrapper<DishComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DishComment::getDishId, dish.getId())
               .eq(DishComment::getCommentStatus, "ACTIVE");
        List<DishComment> activeComments = commentMapper.selectList(wrapper);

        int count = activeComments.size();
        if (count == 0) {
            // 无活跃评论 → 重置为 0
            dish.setAvgRating(BigDecimal.ZERO);
            dish.setReviewCount(0);
        } else {
            // 用 BigDecimal 累加所有评分后取平均
            BigDecimal sum = BigDecimal.ZERO;
            for (DishComment c : activeComments) {
                sum = sum.add(BigDecimal.valueOf(c.getRating()));
            }
            BigDecimal avg = sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
            dish.setAvgRating(avg);
            dish.setReviewCount(count);
        }

        dish.setUpdateTime(new Date());
        dishMapper.updateById(dish);
    }

    @Override
    @Transactional
    public void reportComment(Long commentId) {
        DishComment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        // REPORT_COUNT 自增 1
        LambdaUpdateWrapper<DishComment> wrapper = new LambdaUpdateWrapper<>();
        wrapper.setSql("REPORT_COUNT = REPORT_COUNT + 1")
               .eq(DishComment::getId, commentId);
        commentMapper.update(null, wrapper);
    }

    @Override
    public List<Object> getRedRanking() {
        LambdaQueryWrapper<CampusDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusDish::getDishStatus, "ACTIVE")
               .gt(CampusDish::getReviewCount, 3)
               .orderByDesc(CampusDish::getAvgRating)
               .last("AND ROWNUM <= 10");
        return List.copyOf(dishMapper.selectList(wrapper));
    }

    @Override
    public List<Object> getBlackRanking() {
        LambdaQueryWrapper<CampusDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusDish::getDishStatus, "ACTIVE")
               .gt(CampusDish::getReviewCount, 3)
               .orderByAsc(CampusDish::getAvgRating)
               .last("AND ROWNUM <= 10");
        return List.copyOf(dishMapper.selectList(wrapper));
    }
}

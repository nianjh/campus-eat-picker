package com.campus.eatpicker.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.dto.CommentRequestDTO;
import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.DishCommentMapper;
import com.campus.eatpicker.service.DishBusinessService;
import com.campus.eatpicker.service.WheelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜品与评论控制器
 *
 * 挂载在 /api/dish 下，受 JwtInterceptor 身份认证保护。
 * 提供转盘候选池、评论发表、举报、红黑榜等公共接口。
 */
@RestController
@RequestMapping("/api/dish")
@RequiredArgsConstructor
public class DishAndCommentController {

    private final WheelService wheelService;
    private final DishBusinessService dishBusinessService;
    private final DishCommentMapper commentMapper;

    /**
     * 拉取转盘候选池 —— 所有 ACTIVE 菜品
     * 前端冷启动时调用此接口替代硬编码 DEFAULT_DISHES
     */
    @GetMapping("/candidates")
    public Result<List<WheelResultDTO>> getCandidates() {
        List<WheelResultDTO> dishes = wheelService.getCandidateDishes(null);
        return Result.success(dishes);
    }

    /**
     * 发表毒舌评论
     */
    @PostMapping("/comment")
    public Result<DishComment> postComment(@RequestBody CommentRequestDTO request) {
        DishComment comment = dishBusinessService.postComment(request);
        return Result.success(comment);
    }

    /**
     * 举报评论 —— REPORT_COUNT 自增 1
     */
    @PostMapping("/report/{commentId}")
    public Result<Void> reportComment(@PathVariable("commentId") Long commentId) {
        dishBusinessService.reportComment(commentId);
        return Result.success(null);
    }

    /**
     * 获取指定菜品的评论列表
     */
    @GetMapping("/{dishId}/comments")
    public Result<List<DishComment>> getCommentsByDish(@PathVariable("dishId") Long dishId) {
        LambdaQueryWrapper<DishComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DishComment::getDishId, dishId)
               .eq(DishComment::getCommentStatus, "ACTIVE")
               .orderByDesc(DishComment::getCreateTime);
        return Result.success(commentMapper.selectList(wrapper));
    }

    /**
     * 红榜 —— Top 10 白月光神菜
     */
    @GetMapping("/ranking/red")
    public Result<List<Object>> getRedRanking() {
        return Result.success(dishBusinessService.getRedRanking());
    }

    /**
     * 黑榜 —— Top 10 避雷黑暗料理
     */
    @GetMapping("/ranking/black")
    public Result<List<Object>> getBlackRanking() {
        return Result.success(dishBusinessService.getBlackRanking());
    }
}

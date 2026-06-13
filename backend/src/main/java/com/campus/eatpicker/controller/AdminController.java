package com.campus.eatpicker.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.entity.AppUser;
import com.campus.eatpicker.entity.CampusDish;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.AppUserMapper;
import com.campus.eatpicker.mapper.CampusDishMapper;
import com.campus.eatpicker.mapper.DishCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 安全管理后台控制器
 *
 * 挂在 /api/admin/** 路由下，受 AdminInterceptor RBAC 盾牌保护。
 * 非 ADMIN 角色的请求在到达此 Controller 之前即被拦截返回 403。
 *
 * 提供三大核心能力：
 * 1. 菜品管理（增/改/删）
 * 2. 恶评斩杀（拉取举报列表 + 隐藏评论）
 * 3. 封印此魂（封禁用户）
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CampusDishMapper dishMapper;
    private final DishCommentMapper commentMapper;
    private final AppUserMapper userMapper;

    // ─── 菜品管理 ────────────────────────────

    /**
     * 新增菜品（管理员手动录入转盘池）
     */
    @PostMapping("/dish")
    public Result<CampusDish> createDish(@RequestBody CampusDish dish) {
        dish.setDishStatus("ACTIVE");
        dish.setCreateTime(new Date());
        dish.setUpdateTime(new Date());
        if (dish.getWeightFactor() == null) {
            dish.setWeightFactor(BigDecimal.ONE);
        }
        dishMapper.insert(dish);
        return Result.success(dish);
    }

    /**
     * 更新菜品（调整权重因子、价格、名称等）
     */
    @PutMapping("/dish")
    public Result<CampusDish> updateDish(@RequestBody CampusDish dish) {
        dish.setUpdateTime(new Date());
        dishMapper.updateById(dish);
        return Result.success(dishMapper.selectById(dish.getId()));
    }

    /**
     * 下架菜品（软删除，状态置为 HIDDEN，不再出现在转盘中）
     *
     * 使用显式路径变量名绑定 @PathVariable("id")，
     * 彻底免疫达梦大小写敏感底座解析时抛出的 InvalidDataType / MissingPathVariable 异常。
     */
    @DeleteMapping("/dish/{id}")
    public Result<Void> deleteDish(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<CampusDish> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(CampusDish::getDishStatus, "HIDDEN")
               .set(CampusDish::getUpdateTime, new Date())
               .eq(CampusDish::getId, id);
        dishMapper.update(null, wrapper);
        return Result.success(null);
    }

    // ─── 评论管理 ────────────────────────────

    /**
     * 拉取全部评论列表（按创建时间倒序）
     */
    @GetMapping("/comment/all")
    public Result<List<DishComment>> listAllComments() {
        LambdaQueryWrapper<DishComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(DishComment::getCreateTime);
        return Result.success(commentMapper.selectList(wrapper));
    }

    /**
     * 拉取被举报次数 >= 1 的恶评列表（按举报次数倒序）
     */
    @GetMapping("/comment/reported")
    public Result<List<DishComment>> listReportedComments() {
        LambdaQueryWrapper<DishComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(DishComment::getReportCount, 1)
               .eq(DishComment::getCommentStatus, "ACTIVE")
               .orderByDesc(DishComment::getReportCount);
        return Result.success(commentMapper.selectList(wrapper));
    }

    /**
     * 正义斩杀 —— 将评论状态变更为 HIDDEN
     */
    @DeleteMapping("/comment/{id}")
    public Result<Void> hideComment(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<DishComment> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(DishComment::getCommentStatus, "HIDDEN")
               .eq(DishComment::getId, id);
        commentMapper.update(null, wrapper);
        return Result.success(null);
    }

    // ─── 用户管理 ────────────────────────────

    /**
     * 封印此魂 —— 封禁指定用户账号
     */
    @PostMapping("/user/ban/{id}")
    public Result<Void> banUser(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<AppUser> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(AppUser::getAccountStatus, "BANNED")
               .set(AppUser::getUpdateTime, new Date())
               .eq(AppUser::getId, id);
        userMapper.update(null, wrapper);
        return Result.success(null);
    }
}

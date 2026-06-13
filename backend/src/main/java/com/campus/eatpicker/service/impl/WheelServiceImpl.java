package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.dto.SpinRequestDTO;
import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.entity.CampusDish;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.CampusDishMapper;
import com.campus.eatpicker.mapper.DishCommentMapper;
import com.campus.eatpicker.service.WheelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * 大转盘核心服务实现
 *
 * 核心设计：
 * - 多维度加权随机算法：低分反向恶搞、高分白月光、刺客保护
 * - 动态毒舌文案引擎：4 组模板池，低分菜 30% 追加伤害
 * - 所有数值计算均带 null 安全防护
 */
@Service
@RequiredArgsConstructor
public class WheelServiceImpl implements WheelService {

    private final CampusDishMapper dishMapper;
    private final DishCommentMapper commentMapper;

    @Override
    public List<WheelResultDTO> getCandidateDishes(Long canteenId) {
        LambdaQueryWrapper<CampusDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusDish::getDishStatus, "ACTIVE");
        List<CampusDish> dishes = dishMapper.selectList(wrapper);
        return dishes.stream()
                .map(d -> WheelResultDTO.builder()
                        .dishId(d.getId())
                        .dishName(d.getDishName())
                        .stallName(d.getStallName())
                        .canteenName(d.getCanteenName())
                        .price(d.getPrice() != null ? d.getPrice().doubleValue() : null)
                        .avgRating(d.getAvgRating() != null ? d.getAvgRating().doubleValue() : null)
                        .imageUrl(d.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public WheelResultDTO spin(SpinRequestDTO request) {
        // 1. 拉取候选菜品
        LambdaQueryWrapper<CampusDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusDish::getDishStatus, "ACTIVE");
        if (request.getCanteenName() != null && !request.getCanteenName().isBlank()) {
            wrapper.eq(CampusDish::getCanteenName, request.getCanteenName());
        }
        List<CampusDish> dishes = dishMapper.selectList(wrapper);
        if (dishes.isEmpty()) {
            return WheelResultDTO.fallback("食堂还没开门，你先饿着吧。");
        }

        // 2. 计算每条菜品的转盘权重
        List<WeightedItem> items = dishes.stream()
                .map(d -> new WeightedItem(d, computeWeight(d)))
                .collect(Collectors.toList());

        // 3. 加权随机抽取
        WeightedItem picked = weightedRandomPick(items);

        // 4. 生成毒舌文案
        String roastText = generateRoastText(picked.dish);

        // 5. 组装返回
        return WheelResultDTO.builder()
                .dishId(picked.dish.getId())
                .dishName(picked.dish.getDishName())
                .stallName(picked.dish.getStallName())
                .canteenName(picked.dish.getCanteenName())
                .price(picked.dish.getPrice() != null ? picked.dish.getPrice().doubleValue() : null)
                .imageUrl(picked.dish.getImageUrl())
                .avgRating(picked.dish.getAvgRating() != null ? picked.dish.getAvgRating().doubleValue() : null)
                .roastText(roastText)
                .build();
    }

    // ─── 权重计算 ───────────────────────────────────────

    /**
     * 权重计算策略（全部带 null 安全防护）：
     * - 低分菜（avgRating < 2.5）：权重 × 3.0 —— 很难吃不等于你就不该再吃一次
     * - 高分爆款（avgRating >= 4.0）：权重 × 1.5 —— 白月光值得反复
     * - 已有黑榜热度的菜品：权重 × 2.0 —— 越多人骂越应该被抽到
     * - 价格刺客（price > 35）：权重 × 0.3 —— 不能真把你往破产了送
     * - 评分处于 2.5~3.9 的"平庸菜"：权重 = 基础值（1.0）—— 抽到算你倒霉
     */
    private double computeWeight(CampusDish dish) {
        double baseWeight = dish.getWeightFactor() != null ? dish.getWeightFactor().doubleValue() : 1.0;
        double rating = dish.getAvgRating() != null ? dish.getAvgRating().doubleValue() : 3.0;
        double price = dish.getPrice() != null ? dish.getPrice().doubleValue() : 10.0;
        double reviewCount = dish.getReviewCount() != null ? dish.getReviewCount().doubleValue() : 0;

        double multiplier = 1.0;

        if (rating < 2.5) {
            multiplier = 3.0;      // 黑暗料理：让你再遭一次罪
        } else if (rating >= 4.0) {
            multiplier = 1.5;      // 白月光：值得反复抽
        }

        if (reviewCount >= 20 && rating < 3.0) {
            multiplier = Math.max(multiplier, 2.0); // 黑榜热度加持
        }

        if (price > 35.0) {
            multiplier *= 0.3;     // 刺客保护机制
        }

        return baseWeight * multiplier;
    }

    // ─── 加权随机算法 ──────────────────────────────────

    /**
     * 加权随机抽取
     *
     * 利用 ThreadLocalRandom 在累计权重区间内进行精确命中。
     * 遍历菜品列表，当随机值小于等于累计权重时返回当前菜品。
     * 浮点精度边界 case：若遍历结束未命中，返回最后一个菜品作为兜底。
     */
    private WeightedItem weightedRandomPick(List<WeightedItem> items) {
        double totalWeight = items.stream().mapToDouble(i -> i.weight).sum();
        double random = ThreadLocalRandom.current().nextDouble() * totalWeight;
        double cumulative = 0.0;
        for (WeightedItem item : items) {
            cumulative += item.weight;
            if (random <= cumulative) {
                return item;
            }
        }
        return items.get(items.size() - 1); // Fallback: 返回最后一个
    }

    // ─── 毒舌文案生成 ──────────────────────────────────

    private static final List<String> HIGH_SCORE_TEMPLATES = List.of(
            "此物只应天上有，食堂能做出这个水平，阿姨今天心情一定不错。",
            "这是食堂的良心发现之作，建议趁阿姨还没离职多吃几顿。",
            "你的运气不错，这是全校投票的 TOP 选手，吃完记得给学长学姐磕一个。",
            "抽到它，说明你今天的人品余额还没透支。趁热吃，别刷手机了。"
    );

    private static final List<String> LOW_SCORE_TEMPLATES = List.of(
            "命运在嘲笑你。这道菜的含金量是——含金量为零。",
            "恭喜！你即将解锁「食堂求生」成就。建议搭配老干妈食用。",
            "用两个字形容这道菜：活着。再多一个词：勉强活着。",
            "这不是菜，这是食堂对食物的致敬。建议闭眼吃，减少视觉伤害。",
            "这道菜的主厨可能跟食材有仇。你要是不信邪，就去试试。"
    );

    private static final List<String> EXPENSIVE_TEMPLATES = List.of(
            "价格很美丽，味道很骨感。这一顿够你在外面吃顿火锅了。",
            "食堂刺客，不讲武德。建议先看看余额再张嘴。",
            "这个价位的菜，味道应该是米其林级别的——但它明显不是。"
    );

    private static final List<String> PLAIN_TEMPLATES = List.of(
            "不好吃，也不难吃。它存在的意义就是帮你活着。",
            "吃了跟没吃差不多，属于食堂气氛组选手。",
            "没什么记忆点的菜，但起码不会让你后悔到今晚。",
            "它是食堂里最稳定的存在——稳定地平庸，稳定地饱腹。",
            "这道菜就像你的水课：有它也行，没有更好。"
    );

    /**
     * 根据评分和价格动态生成毒舌文案
     *
     * 分类逻辑：
     * - rating >= 4.0 → 高分白月光模板
     * - rating < 2.5  → 低分黑暗料理模板
     * - price > 35    → 价格刺客模板
     * - 其他          → 平庸菜模板
     *
     * 低分菜有 30% 概率追加"伤害文案"：
     * "上次吃这个的人已经三天没来食堂了。"
     */
    private String generateRoastText(CampusDish dish) {
        double rating = dish.getAvgRating() != null ? dish.getAvgRating().doubleValue() : 3.0;
        double price = dish.getPrice() != null ? dish.getPrice().doubleValue() : 10.0;

        List<String> pool;
        if (rating >= 4.0) {
            pool = HIGH_SCORE_TEMPLATES;
        } else if (rating < 2.5) {
            pool = LOW_SCORE_TEMPLATES;
        } else if (price > 35.0) {
            pool = EXPENSIVE_TEMPLATES;
        } else {
            pool = PLAIN_TEMPLATES;
        }

        // 随机取一条
        int idx = ThreadLocalRandom.current().nextInt(pool.size());
        String template = pool.get(idx);

        // 低分菜追加伤害
        if (rating < 2.5 && ThreadLocalRandom.current().nextDouble() < 0.3) {
            template += " 上次吃这个的人已经三天没来食堂了。";
        }

        return String.format("「%s」—— %s", dish.getDishName(), template);
    }

    // ─── 内部类 ────────────────────────────────────────

    private static class WeightedItem {
        final CampusDish dish;
        final double weight;

        WeightedItem(CampusDish dish, double weight) {
            this.dish = dish;
            this.weight = weight;
        }
    }
}

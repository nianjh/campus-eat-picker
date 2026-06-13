package com.campus.eatpicker.controller;

import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.dto.SpinRequestDTO;
import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.service.WheelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 大转盘控制器
 *
 * 挂载在 /api/wheel 下，spin 端点免 JWT 拦截（由 WebConfig 排除），
 * 确保未登录用户也能体验一次"命运抽签"。
 */
@RestController
@RequestMapping("/api/wheel")
@RequiredArgsConstructor
public class WheelController {

    private final WheelService wheelService;

    /**
     * 🎡 转动命运之轮
     *
     * 前端 fetch-first-then-animate 时序：
     *   点击按钮 → 立刻 POST 此接口 → 转盘进入匀速自转 →
     *   收到响应 → 计算目标角度 → CSS transition 3.5s 减速停靠
     */
    @PostMapping("/spin")
    public Result<WheelResultDTO> spin(@RequestBody SpinRequestDTO request) {
        WheelResultDTO result = wheelService.spin(request);
        return Result.success(result);
    }
}

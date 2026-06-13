package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.dto.SpinRequestDTO;

import java.util.List;

/**
 * 大转盘核心服务
 */
public interface WheelService {

    /**
     * 执行加权随机抽取，返回命中的菜品及毒舌文案
     */
    WheelResultDTO spin(SpinRequestDTO request);

    /**
     * 拉取当前可参与转盘的菜品列表（带权重）
     */
    List<WheelResultDTO> getCandidateDishes(Long canteenId);
}

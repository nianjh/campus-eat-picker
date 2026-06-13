package com.campus.eatpicker.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 转盘抽取结果 DTO
 */
@Data
@Builder
public class WheelResultDTO {
    private Long dishId;
    private String dishName;
    private String stallName;
    private String canteenName;
    private Double price;
    private String imageUrl;
    private Double avgRating;
    private String roastText;       // 毒舌文案
    private String fallbackMessage; // 兜底文案（无菜品时）

    public static WheelResultDTO fallback(String msg) {
        return WheelResultDTO.builder().fallbackMessage(msg).build();
    }
}

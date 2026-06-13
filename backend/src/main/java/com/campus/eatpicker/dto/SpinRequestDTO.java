package com.campus.eatpicker.dto;

import lombok.Data;

/**
 * 转盘请求 DTO
 */
@Data
public class SpinRequestDTO {
    private String canteenName;  // 可选：限定食堂
}

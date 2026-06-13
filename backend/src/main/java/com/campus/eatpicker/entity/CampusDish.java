package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 菜品档口实体类 —— 达梦 DM8 适配
 *
 * 关键约束：
 * - 表名全大写 T_CAMPUS_DISH
 * - 主键 @TableId(type = IdType.AUTO) 让 DB 完全接管自增
 * - 状态列映射 DISH_STATUS（规避 STATUS 保留字）
 * - 价格使用 BigDecimal 保证精度
 */
@Data
@TableName("T_CAMPUS_DISH")
public class CampusDish {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("DISH_NAME")
    private String dishName;

    @TableField("STALL_NAME")
    private String stallName;

    @TableField("CANTEEN_NAME")
    private String canteenName;

    @TableField("FLOOR_NUM")
    private Integer floorNum;

    @TableField("PRICE")
    private BigDecimal price;

    @TableField("IMAGE_URL")
    private String imageUrl;

    @TableField("AVG_RATING")
    private BigDecimal avgRating;

    @TableField("REVIEW_COUNT")
    private Integer reviewCount;

    @TableField("WEIGHT_FACTOR")
    private BigDecimal weightFactor;

    @TableField("DISH_STATUS")
    private String dishStatus;

    @TableField("SUBMIT_USER_ID")
    private Long submitUserId;

    @TableField("CREATE_TIME")
    private Date createTime;

    @TableField("UPDATE_TIME")
    private Date updateTime;
}

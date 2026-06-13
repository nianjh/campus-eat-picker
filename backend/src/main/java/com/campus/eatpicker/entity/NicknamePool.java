package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 花名生成词库实体类
 *
 * 映射 T_NICKNAME_POOL 表，用于一键投胎时随机抽取花名组合。
 */
@Data
@TableName("T_NICKNAME_POOL")
public class NicknamePool {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("ADJECTIVE")
    private String adjective;

    @TableField("FOOD_NAME")
    private String foodName;
}

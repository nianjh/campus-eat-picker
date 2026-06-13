package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 毒舌评论实体类 —— 达梦 DM8 适配
 *
 * 关键约束：
 * - 表名全大写 T_DISH_COMMENT
 * - 主键 @TableId(type = IdType.AUTO)
 * - 状态列映射 COMMENT_STATUS（规避 STATUS 保留字）
 */
@Data
@TableName("T_DISH_COMMENT")
public class DishComment {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("DISH_ID")
    private Long dishId;

    @TableField("USER_ID")
    private Long userId;

    @TableField("RATING")
    private Integer rating;

    @TableField("CONTENT")
    private String content;

    @TableField("ROAST_TEXT")
    private String roastText;

    @TableField("COMMENT_TAGS")
    private String commentTags;

    @TableField("IS_ANONYMOUS")
    private Integer isAnonymous;

    @TableField("LIKE_COUNT")
    private Integer likeCount;

    @TableField("REPORT_COUNT")
    private Integer reportCount;

    @TableField("COMMENT_STATUS")
    private String commentStatus;

    @TableField("CREATE_TIME")
    private Date createTime;
}

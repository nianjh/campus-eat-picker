package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 用户投稿/意见反馈实体 — 达梦 DM8 适配
 */
@Data
@TableName("T_SUGGESTION")
public class Suggestion {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("USER_ID")
    private Long userId;

    @TableField("NICKNAME")
    private String nickname;

    /** FEEDBACK / SUGGEST / NEW_DISH */
    @TableField("SUGG_TYPE")
    private String suggType;

    @TableField("CONTENT")
    private String content;

    /** PENDING / REVIEWED / CLOSED */
    @TableField("SUGG_STATUS")
    private String suggStatus;

    @TableField("ADMIN_NOTE")
    private String adminNote;

    @TableField("CREATE_TIME")
    private Date createTime;
}

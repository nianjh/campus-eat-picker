package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 用户实体类 —— 达梦 DM8 适配
 *
 * 关键约束：
 * - 表名大写 T_APP_USER（达梦默认大小写敏感）
 * - 主键 @TableId(type = IdType.AUTO) 让 DB 完全接管自增，MyBatis-Plus 不生成 id 值
 * - 所有字段 @TableField 显式大写映射
 * - 密码列映射 USER_PWD（规避 PASSWORD 保留字）
 * - 角色列映射 USER_ROLE（规避 ROLE 保留字）
 * - 状态列映射 ACCOUNT_STATUS（规避 STATUS 保留字）
 */
@Data
@TableName("T_APP_USER")
public class AppUser {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("NICKNAME")
    private String nickname;

    @TableField("STUDENT_ID")
    private String studentId;

    @TableField("AVATAR_URL")
    private String avatarUrl;

    @TableField("USER_PWD")
    private String password;

    @TableField("USER_ROLE")
    private String userRole;

    @TableField("ACCOUNT_STATUS")
    private String accountStatus;

    @TableField("LAST_LOGIN_TIME")
    private Date lastLoginTime;

    @TableField("CREATE_TIME")
    private Date createTime;

    @TableField("UPDATE_TIME")
    private Date updateTime;
}

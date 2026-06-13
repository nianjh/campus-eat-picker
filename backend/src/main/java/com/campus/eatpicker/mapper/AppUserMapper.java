package com.campus.eatpicker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.eatpicker.entity.AppUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户表 Mapper
 */
@Mapper
public interface AppUserMapper extends BaseMapper<AppUser> {
}

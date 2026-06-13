package com.campus.eatpicker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.eatpicker.entity.CampusDish;
import org.apache.ibatis.annotations.Mapper;

/**
 * 菜品档口表 Mapper
 */
@Mapper
public interface CampusDishMapper extends BaseMapper<CampusDish> {
}

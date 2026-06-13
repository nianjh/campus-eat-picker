package com.campus.eatpicker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.eatpicker.entity.DishComment;
import org.apache.ibatis.annotations.Mapper;

/**
 * 毒舌评论表 Mapper
 */
@Mapper
public interface DishCommentMapper extends BaseMapper<DishComment> {
}

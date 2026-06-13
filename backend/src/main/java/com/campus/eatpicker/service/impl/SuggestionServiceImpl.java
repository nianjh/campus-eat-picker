package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.dto.SuggestionRequestDTO;
import com.campus.eatpicker.entity.Suggestion;
import com.campus.eatpicker.mapper.SuggestionMapper;
import com.campus.eatpicker.service.SuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestionServiceImpl implements SuggestionService {

    private final SuggestionMapper suggestionMapper;

    private static final Set<String> VALID_TYPES = Set.of("FEEDBACK", "SUGGEST", "NEW_DISH");

    @Override
    @Transactional
    public Suggestion submit(Long userId, String nickname, SuggestionRequestDTO request) {
        if (request.getSuggType() == null || !VALID_TYPES.contains(request.getSuggType())) {
            throw new RuntimeException("投稿类型无效，可选：FEEDBACK / SUGGEST / NEW_DISH");
        }
        if (request.getContent() == null || request.getContent().trim().length() < 5) {
            throw new RuntimeException("内容太短了，至少写5个字吧！");
        }
        if (request.getContent().trim().length() > 2000) {
            throw new RuntimeException("内容太长，最多2000字");
        }

        Suggestion s = new Suggestion();
        s.setUserId(userId);
        s.setNickname(nickname);
        s.setSuggType(request.getSuggType());
        s.setContent(request.getContent().trim());
        s.setSuggStatus("PENDING");
        s.setCreateTime(new Date());

        suggestionMapper.insert(s);
        return s;
    }

    @Override
    public List<Suggestion> listAll() {
        LambdaQueryWrapper<Suggestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Suggestion::getCreateTime);
        return suggestionMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public Suggestion handle(Long id, String status, String adminNote) {
        Suggestion s = suggestionMapper.selectById(id);
        if (s == null) {
            throw new RuntimeException("投稿不存在");
        }
        if (status != null && Set.of("REVIEWED", "CLOSED").contains(status)) {
            s.setSuggStatus(status);
        }
        if (adminNote != null) {
            s.setAdminNote(adminNote);
        }
        suggestionMapper.updateById(s);
        return s;
    }

    @Override
    public Map<String, Long> countByType() {
        List<Suggestion> all = suggestionMapper.selectList(null);
        return all.stream()
                .collect(Collectors.groupingBy(Suggestion::getSuggType, Collectors.counting()));
    }
}

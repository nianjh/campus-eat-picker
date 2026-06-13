package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;
import com.campus.eatpicker.dto.RegisterRequestDTO;
import com.campus.eatpicker.dto.UpdateProfileRequestDTO;
import com.campus.eatpicker.dto.UserProfileDTO;
import com.campus.eatpicker.entity.AppUser;
import com.campus.eatpicker.entity.NicknamePool;
import com.campus.eatpicker.mapper.AppUserMapper;
import com.campus.eatpicker.mapper.NicknamePoolMapper;
import com.campus.eatpicker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 用户业务层实现
 *
 * 核心设计：
 * - 一键投胎使用 O(1) ROWNUM+OFFSET 随机抽取（废弃 ORDER BY RANDOM() 全表扫描）
 * - 花名去重使用 ThreadLocalRandom 高性能兜底（不使用 UUID，防止熵池耗尽）
 * - 密码统一 BCrypt 加密（工作因子 10）
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AppUserMapper appUserMapper;
    private final NicknamePoolMapper nicknamePoolMapper;

    // 一键投胎的默认密码，用 BCrypt 哈希后存储
    private static final String DEFAULT_PASSWORD = "EatOrNot666";

    // 开场白词库 —— 每次投胎成功后随机抽一句
    private static final List<String> WELCOME_MESSAGES = List.of(
            "欢迎来到食堂吃瓜一线！你的花名已就位，去转盘试试今日运势吧。",
            "投胎成功！你在本食堂的身份已生效，评论区请嘴下留情。",
            "恭喜你获得新身份！从今天起，你也是食堂点评圈的人了。",
            "命运的齿轮开始转动...你的第一顿午饭，交给转盘决定吧！",
            "花名已刻入食堂族谱。记住它，它就是你在本平台的身份证。",
            "你的食生重开了。这次请务必避开一楼那个窗口。",
            "新账号已就绪。不要害怕 — 食堂再难吃，也有花名替你扛。"
    );

    @Override
    @Transactional
    public AuthResultDTO quickRegister() {
        // 1. 信创全版本通杀随机解法：先 count 再 ROWNUM + OFFSET，O(1)
        //    废弃 ORDER BY RANDOM()（全表扫描 + CPU 飙升至 100%）
        long total = nicknamePoolMapper.selectCount(null);
        if (total == 0) {
            return buildFallbackUser();
        }
        long randomOffset = ThreadLocalRandom.current().nextLong(total);
        LambdaQueryWrapper<NicknamePool> wrapper = new LambdaQueryWrapper<>();
        wrapper.last("AND ROWNUM = 1 OFFSET " + randomOffset);
        NicknamePool pool = nicknamePoolMapper.selectOne(wrapper);

        if (pool == null) {
            return buildFallbackUser();
        }

        String adjective = pool.getAdjective();
        String foodName = pool.getFoodName();
        String rawNickname = adjective + foodName;

        // 2. 花名去重
        String nickname = ensureUniqueNickname(rawNickname);

        // 3. 构建用户实体
        AppUser user = new AppUser();
        user.setNickname(nickname);
        user.setPassword(BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt(10)));
        user.setUserRole("STUDENT");
        user.setAccountStatus("ACTIVE");
        user.setLastLoginTime(new Date());
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());

        // 4. 写入数据库，达梦 IDENTITY 自增列自动回填 id
        appUserMapper.insert(user);

        // 5. 随机挑选一句欢迎语
        String welcome = WELCOME_MESSAGES.get(
                ThreadLocalRandom.current().nextInt(WELCOME_MESSAGES.size()));

        return AuthResultDTO.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .userRole(user.getUserRole())
                .avatarUrl(user.getAvatarUrl())
                .welcomeMessage(welcome)
                .build();
    }

    /**
     * 确保花名唯一：达梦大小写敏感场景下精确查询
     *
     * 去重策略：
     * 1. 先查原始花名是否已存在
     * 2. 撞名 → 追加 3 位随机数字（最多重试 10 次）
     * 3. 极端频发撞名 → 基于内存的 6 位十六进制短码兜底
     *    (使用 ThreadLocalRandom，不用 UUID，防止高并发下 SecureRandom 耗尽容器熵池导致线程假死)
     */
    private String ensureUniqueNickname(String raw) {
        LambdaQueryWrapper<AppUser> check = new LambdaQueryWrapper<>();
        check.eq(AppUser::getNickname, raw);
        if (appUserMapper.selectCount(check) == 0) {
            return raw;
        }
        // 撞名了 —— 追加随机数字，最多尝试 10 次
        for (int i = 0; i < 10; i++) {
            String suffix = String.format("%03d", ThreadLocalRandom.current().nextInt(1000));
            String candidate = raw + suffix;
            check = new LambdaQueryWrapper<>();
            check.eq(AppUser::getNickname, candidate);
            if (appUserMapper.selectCount(check) == 0) {
                return candidate;
            }
        }
        // 真撞了 10 次？上基于内存的高性能 6 位短码兜底
        // 不用 UUID.randomUUID() —— 高并发下 SecureRandom 耗尽 Linux 容器熵池导致线程假死阻塞
        // 不用 System.currentTimeMillis() & 0xFFFF —— 同一毫秒必撞唯一索引爆 500
        return raw + Integer.toHexString(
                ThreadLocalRandom.current().nextInt(0x100000, 0xFFFFFF)).toUpperCase();
    }

    /**
     * 兜底：词库为空时用硬编码生成
     */
    private AuthResultDTO buildFallbackUser() {
        String[] adjs = {"摆烂的", "emo的", "社恐的", "暴躁的", "摸鱼的"};
        String[] foods = {"黄焖鸡", "麻辣烫", "螺蛳粉", "炸鸡排", "奶茶"};
        String raw = adjs[ThreadLocalRandom.current().nextInt(adjs.length)]
                   + foods[ThreadLocalRandom.current().nextInt(foods.length)];
        String nickname = ensureUniqueNickname(raw);

        AppUser user = new AppUser();
        user.setNickname(nickname);
        user.setPassword(BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt(10)));
        user.setUserRole("STUDENT");
        user.setAccountStatus("ACTIVE");
        user.setLastLoginTime(new Date());
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());
        appUserMapper.insert(user);

        return AuthResultDTO.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .userRole(user.getUserRole())
                .welcomeMessage("词库离家出走了，但命运还是给了你一个花名。欢迎。")
                .build();
    }

    // ─── 传统注册 ──────────────────────────

    @Override
    @Transactional
    public AuthResultDTO register(RegisterRequestDTO request) {
        String studentId = request.getStudentId();
        String password = request.getPassword();
        String nickname = request.getNickname();

        // 1. 学号校验：10位数字
        if (studentId == null || !studentId.matches("\\d{10}")) {
            throw new RuntimeException("学号必须是10位数字，例如 2023212099");
        }

        // 2. 密码校验：至少6位
        if (password == null || password.length() < 6) {
            throw new RuntimeException("密码至少需要6位，别偷懒!");
        }

        // 3. 学号唯一性检查
        LambdaQueryWrapper<AppUser> check = new LambdaQueryWrapper<>();
        check.eq(AppUser::getStudentId, studentId);
        if (appUserMapper.selectCount(check) > 0) {
            throw new RuntimeException("该学号已被注册，请直接登录或换个学号");
        }

        // 4. 花名：没填就随机生成
        if (nickname == null || nickname.trim().isEmpty()) {
            nickname = generateNickname();
        } else {
            // 用户自定义花名也要去重
            nickname = ensureUniqueNickname(nickname.trim());
        }

        // 5. 构建用户
        AppUser user = new AppUser();
        user.setStudentId(studentId);
        user.setNickname(nickname);
        user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt(10)));
        user.setUserRole("STUDENT");
        user.setAccountStatus("ACTIVE");
        user.setLastLoginTime(new Date());
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());

        appUserMapper.insert(user);

        // 6. 欢迎语
        String welcome = "注册成功！" + nickname + "，你的食生从今天开始。去转盘试一下今日运势吧！";

        return AuthResultDTO.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .userRole(user.getUserRole())
                .avatarUrl(user.getAvatarUrl())
                .welcomeMessage(welcome)
                .build();
    }

    /**
     * 随机生成花名（注册未填花名时使用）
     */
    private String generateNickname() {
        long total = nicknamePoolMapper.selectCount(null);
        if (total > 0) {
            long randomOffset = ThreadLocalRandom.current().nextLong(total);
            LambdaQueryWrapper<NicknamePool> wrapper = new LambdaQueryWrapper<>();
            wrapper.last("AND ROWNUM = 1 OFFSET " + randomOffset);
            NicknamePool pool = nicknamePoolMapper.selectOne(wrapper);
            if (pool != null) {
                return ensureUniqueNickname(pool.getAdjective() + pool.getFoodName());
            }
        }
        // fallback
        String[] adjs = {"摆烂的", "emo的", "社恐的", "暴躁的", "摸鱼的"};
        String[] foods = {"黄焖鸡", "麻辣烫", "螺蛳粉", "炸鸡排", "奶茶"};
        String raw = adjs[ThreadLocalRandom.current().nextInt(adjs.length)]
                   + foods[ThreadLocalRandom.current().nextInt(foods.length)];
        return ensureUniqueNickname(raw);
    }

    // ─── 传统登录 ──────────────────────────

    @Override
    public AuthResultDTO login(LoginRequestDTO request) {
        LambdaQueryWrapper<AppUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AppUser::getStudentId, request.getStudentId());
        AppUser user = appUserMapper.selectOne(wrapper);

        if (user == null) {
            throw new RuntimeException("学号不存在，要不试试一键投胎？");
        }
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误！你不是本人吧？");
        }
        if ("BANNED".equals(user.getAccountStatus())) {
            throw new RuntimeException("你的账号已被封禁，请联系管理员申诉。");
        }

        // 更新最近登录时间
        user.setLastLoginTime(new Date());
        appUserMapper.updateById(user);

        return AuthResultDTO.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .userRole(user.getUserRole())
                .avatarUrl(user.getAvatarUrl())
                .welcomeMessage("欢迎回来，" + user.getNickname() + "！食堂最近又多了几个新雷，转盘已更新。")
                .build();
    }

    // ─── 个人主页 ──────────────────────────

    @Override
    public UserProfileDTO getProfile(Long userId) {
        AppUser user = appUserMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在或已被删除");
        }
        return UserProfileDTO.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .studentId(user.getStudentId())
                .userRole(user.getUserRole())
                .avatarUrl(user.getAvatarUrl())
                .accountStatus(user.getAccountStatus())
                .lastLoginTime(user.getLastLoginTime())
                .createTime(user.getCreateTime())
                .build();
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UpdateProfileRequestDTO request) {
        AppUser user = appUserMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在或已被删除");
        }

        // 绑定学号（仅未绑定用户可用，一次性操作）
        if (request.getStudentId() != null && !request.getStudentId().trim().isEmpty()) {
            String sid = request.getStudentId().trim();
            if (user.getStudentId() != null && !user.getStudentId().isEmpty()) {
                throw new RuntimeException("你已经绑定过学号了，不可重复绑定");
            }
            if (!sid.matches("\\d{10}")) {
                throw new RuntimeException("学号必须是10位数字，例如 2023212099");
            }
            LambdaQueryWrapper<AppUser> check = new LambdaQueryWrapper<>();
            check.eq(AppUser::getStudentId, sid);
            if (appUserMapper.selectCount(check) > 0) {
                throw new RuntimeException("该学号已被其他用户绑定");
            }
            user.setStudentId(sid);
        }

        // 改花名
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            String newNick = request.getNickname().trim();
            if (newNick.length() > 20) {
                throw new RuntimeException("花名最长20个字符");
            }
            user.setNickname(ensureUniqueNickname(newNick));
        }

        // 改密码
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new RuntimeException("改密码需要先输入当前密码");
            }
            if (!BCrypt.checkpw(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("当前密码不正确");
            }
            if (request.getNewPassword().length() < 6) {
                throw new RuntimeException("新密码至少需要6位");
            }
            user.setPassword(BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt(10)));
        }

        user.setUpdateTime(new Date());
        appUserMapper.updateById(user);

        return getProfile(userId);
    }
}

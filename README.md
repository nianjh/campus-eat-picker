# 校园"今天吃什么"随机大转盘 + 毒舌点评网项目全套设计文档（终审封板生产级白皮书）

> 吃什么是世纪难题。我们把命运交给概率，把真相交给毒舌。

---

## 1. 项目概述与定位

### 1.1 项目背景

每一个大学生都曾在饭点站在食堂门口发出灵魂拷问：**"今天吃什么？"**

食堂档口琳琅满目——黄焖鸡、麻辣烫、铁板烧、石锅拌饭——但选择越多，决策越瘫痪。这不仅是饥饿问题，更是**决策疲劳（Decision Fatigue）** 的经典场景：每天重复三次的"吃什么"消耗了大学生本就不富裕的意志力池。

"校园今天吃什么"（what-to-eat-wheel）就是为终结这个世纪难题而生。

### 1.2 核心亮点

| 亮点 | 说明 |
|------|------|
| **命运大转盘** | 随机性才是最好的决策者。摇一摇，让概率替你决定。权重可调——被疯狂吐槽的黑榜菜更容易被抽中（因为你值得拥有这种"惊喜"）。 |
| **毒舌点评系统** | 食堂没有大众点评？我们自己做。五星白月光 vs 一星黑暗料理，评论自带阴阳怪气 buff。 |
| **红黑榜排行** | 全校公投的"神菜 Top 10"和"避雷 Top 10"。数据驱动选饭——群众的嘴是堵不住的。 |
| **匿名/花名系统** | 取个沙雕花名（比如"麻辣烫教父"），畅所欲言不社死。 |
| **UGC 内容生态** | 人人都能添加新菜品、上传档口位置，内容先发后审 + 举报机制，去中心化内容生产。 |

### 1.3 项目定位

> **一个用随机性解决选择困难、用毒舌点评提供真实避雷指南的校园美食工具。**
>
> 不是又一个平平无奇的点评 App——它是你饭点的快乐来源，是食堂黑暗料理的正义审判庭，是大学生活的一部分 meme 文化。

---

## 2. 需求分析 (Requirements)

### 2.1 核心功能模块

```
┌──────────────────────────────────────────────────────────┐
│                 what-to-eat-wheel                        │
├─────────────┬─────────────┬─────────────┬───────────────┤
│ 🎡 命运转盘  │ 💬 毒舌点评   │ 🏆 红黑榜    │ 🎭 花名系统    │
│ 加权随机抽取 │ 评分+文案生成│ 神菜 / 避雷  │ 匿名身份体系   │
├─────────────┼─────────────┼─────────────┼───────────────┤
│ 📝 UGC投稿   │ 🔍 搜索/筛选  │ 📊 个人主页   │ 🛡️ 内容审核    │
│ 添加菜品/档口│ 按档口/评分  │ 我的评论/收藏│ 举报+先发后审  │
└─────────────┴─────────────┴─────────────┴───────────────┘
```

#### 2.1.1 命运大转盘
- 视觉化轮盘，支持触摸拖拽 / 点击启动
- 权重算法：评分越低（黑暗料理），被抽中概率越高（反向恶搞机制）；高分菜也有 1.5× 加权
- 每次抽中弹窗显示毒舌文案卡片
- 支持按档口筛选（"我今天就只想去二楼"）

#### 2.1.2 毒舌点评区
- 1-5 星评分 + 文字评论
- 系统自动根据评分、价格、历史评论数生成 AI 毒舌文案
- 分类标签：#黑暗料理 #性价比战神 #排队排到死 #食堂刺客
- 点赞/踩、评论回复

#### 2.1.3 红黑榜排行
- 红榜：全校评分 Top 20，按档口/品类筛选
- 黑榜：全校评分 Bottom 20，含"被吐槽最多"子榜单
- 每周自动生成周报："本周你最该后悔吃过的三道菜"

#### 2.1.4 花名 / 匿名系统
- 注册时自动生成沙雕花名（形容词 + 食物名），如"暴躁的黄焖鸡"、"emo 的麻辣香锅"
- 可手动修改（每 30 天限 1 次）
- 发布评论可选"花名显示"或"完全匿名"

#### 2.1.5 UGC 投稿
- 用户提交新菜品（名称、档口、价格、照片 URL）
- 先发后审：提交即上线，触发后台审核
- 10 人以上举报自动下架 + 人工复核

#### 2.1.6 管理后台
- 菜品审核（通过 / 驳回 / 修改）
- 评论管理（删评 / 折叠 / 禁言用户）
- 数据看板（日活、转盘次数、新增点评数）

### 2.2 非功能需求

| 需求 | 说明 |
|------|------|
| **防爆与合规** | 敏感词过滤（基于 Trie + 词库），评论先发显示但标记"审核中"，被举报 10 次自动隐藏 |
| **先发后审 + 举报** | 发布即展示，降低用户挫败感；社区自治举报兜底 |
| **移动端优先** | 375px-414px 视口完美适配，PWA 可添加到桌面，触摸优化 |
| **并发能力** | 支撑 5000 日活，峰值 QPS 100。转盘接口 < 200ms |
| **数据安全** | 密码 bcrypt + salt，SQL 参数化查询防注入，XSS 过滤 |

---

## 3. 系统架构设计 (Architecture)

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户终端                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ 移动浏览器 │  │ 桌面浏览器 │  │ PWA 桌面  │                      │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘                      │
│        │              │              │                            │
│        └──────────────┼──────────────┘                            │
│                       │ HTTPS                                     │
│              ┌────────▼────────┐                                  │
│              │   Nginx 反向代理  │  ← 静态资源 + API 路由 + 限流      │
│              └────────┬────────┘                                  │
│                       │                                           │
│        ┌──────────────┼──────────────┐                            │
│        │              │              │                            │
│  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐                      │
│  │ React 前端 │  │ Spring    │  │ DM8 达梦   │                     │
│  │ (Nginx    │  │ Boot 后端  │  │ Database   │                     │
│  │  静态托管) │  │ (Java 17) │  │            │                     │
│  └───────────┘  └─────┬─────┘  └───────────┘                      │
│                       │                                           │
│                       │ MyBatis-Plus + DmJdbcDriver               │
│                       ▼                                           │
│              ┌─────────────────┐                                  │
│              │  Redis (可选)    │  ← 热点数据缓存 + 限流计数器       │
│              └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

- **前端**：React 18 + Tailwind CSS 3 + Vite，纯静态资源，Nginx 直接 serve `/usr/share/nginx/html`
- **后端**：Spring Boot 3.x + MyBatis-Plus 3.5.x，RESTful API，统一 JSON 响应
- **数据库**：达梦 DM8，通过 `DmJdbcDriver` 连接
- **部署**：Docker Compose 一键拉起三个容器（nginx + spring-boot + dm8）

### 3.2 达梦数据库（DM8）黄金避坑指南

> 国产数据库不是"MySQL 换皮"。以下是血泪教训汇总，照着做，少踩 80% 的坑。

#### 坑 1：大小写敏感（CASE_SENSITIVE）

达梦默认 **大小写敏感**。这意味着：

```sql
-- 这两句查的是不同的表！
SELECT * FROM t_app_user;   -- 找 "t_app_user"
SELECT * FROM T_APP_USER;   -- 找 "T_APP_USER"
```

**解决方案**：

1. **初始化数据库时**设置 `CASE_SENSITIVE=N`（推荐开发环境）
2. 如果已开启，建表时**表名和字段名全部大写**，SQL 中引用时全部大写
3. 本项目统一策略：**DDL 中表名/字段名全部大写，MyBatis 映射中使用 `@TableField` 显式指定**

#### 坑 2：保留关键字冲突

达梦的保留关键字比 MySQL 多得多。以下字段名会直接爆炸：

```
USER, COMMENT, RANK, ORDER, LEVEL, SIZE, TYPE,
DATE, TIME, TIMESTAMP, DEFAULT, CHECK, INDEX,
VIEW, TRIGGER, PASSWORD, MODE, OFFSET, PATH
```

**解决方案**：用加前缀的命名规避，如 `t_app_user` 而非 `user`，`comment_content` 而非 `comment`，`rank_score` 而非 `rank`。

#### 坑 3：自增主键策略

达梦用 `IDENTITY` 而非 `AUTO_INCREMENT`：

```sql
-- ✅ 达梦正确写法
id BIGINT IDENTITY(1,1) NOT NULL

-- ❌ MySQL 写法，达梦不支持
id BIGINT AUTO_INCREMENT NOT NULL
```

#### 坑 4：IDENTITY 自增与 MyBatis-Plus 的数据劫持

达梦 `IDENTITY(1,1)` 是**数据库自主管理**的自增列。如果 MyBatis-Plus 在 INSERT 时生成了 `id = null` 或 `id = 0` 并拼入 SQL，达梦直接报错：**"不能向自增列插入值"**。

**标准解决方案（三层联动）：**

1. **实体类**：主键字段必须显式声明 `@TableId(type = IdType.AUTO)`，告诉 MP 不要生成 ID 值：

```java
@Data
@TableName("T_APP_USER")
public class AppUser {
    @TableId(type = IdType.AUTO)   // ← 关键：让 DB 接管自增
    private Long id;
    // ...
}
```

2. **YAML 配置**：`id-type: auto` 只是全局默认值，实体类上的 `@TableId` 优先级更高，两者配合使用：

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: auto              # 全局默认，实体类 @TableId 可覆盖
```

3. **达梦 dm.ini**：确保 `IDENTITY_INSERT` 为默认关闭状态（默认即关闭），避免意外手动插入：

```ini
# dm.ini —— 保持默认，无需修改
# IDENTITY_INSERT 默认为 0（关闭），达梦完全接管自增
```

#### 坑 5：分页语法

达梦用 `LIMIT m,n` 或 `OFFSET ... FETCH`（需开启兼容模式），MyBatis-Plus 需配置 `dm` 方言。

#### 坑 6：持久化配置

```ini
# dm.ini 关键配置
COMPATIBLE_MODE=4        # 兼容 MySQL 模式
CASE_SENSITIVE=N         # 大小写不敏感（推荐）
LENGTH_IN_CHAR=1         # VARCHAR 按字符计数（适配中文）
```

#### 坑 7：管理后台冷启动 —— 手动钦定超级管理员

一键投胎默认赋予所有用户 `STUDENT` 角色，系统不提供公开注册 ADMIN 通道。第一个管理员账号通过数据库手动升权：

```sql
-- 用 SYSDBA 登录后执行（先完成一次一键投胎，确认用户 id=1 存在）
UPDATE T_APP_USER SET USER_ROLE = 'ADMIN' WHERE ID = 1;
COMMIT;
```

此后该用户登录后 JWT 中携带 `userRole=ADMIN`，前端自动显示管理后台入口，后端 `AdminInterceptor` 基于 JWT claim 做 RBAC 拦截。

---

## 4. 数据库设计 (Database DDL)

### 4.1 用户表

```sql
-- =============================================
-- 用户表（达梦 DM8 语法）
-- =============================================
CREATE TABLE T_APP_USER (
    ID              BIGINT IDENTITY(1,1) NOT NULL,
    NICKNAME        VARCHAR(50)   NOT NULL,
    STUDENT_ID      VARCHAR(30),
    AVATAR_URL      VARCHAR(500),
    USER_PWD        VARCHAR(200)  NOT NULL,
    USER_ROLE       VARCHAR(20)   DEFAULT 'STUDENT',
    ACCOUNT_STATUS  VARCHAR(20)   DEFAULT 'ACTIVE',
    LAST_LOGIN_TIME TIMESTAMP,
    CREATE_TIME     TIMESTAMP     DEFAULT SYSDATE,
    UPDATE_TIME     TIMESTAMP     DEFAULT SYSDATE,
    PRIMARY KEY (ID)
);

COMMENT ON TABLE  T_APP_USER IS '用户表 —— 支持一键投胎免密注册 + 传统学号登录双通道';
COMMENT ON COLUMN T_APP_USER.ID              IS '主键ID（达梦 IDENTITY 自增，由 DB 完全接管）';
COMMENT ON COLUMN T_APP_USER.NICKNAME        IS '花名/昵称（一键投胎随机生成，全站唯一）';
COMMENT ON COLUMN T_APP_USER.STUDENT_ID      IS '学号（可选，传统登录用；一键投胎用户可为空）';
COMMENT ON COLUMN T_APP_USER.AVATAR_URL      IS '头像地址';
COMMENT ON COLUMN T_APP_USER.USER_PWD        IS '加密密码(bcrypt)；一键投胎默认 EatOrNot666；规避 PASSWORD 保留字';
COMMENT ON COLUMN T_APP_USER.USER_ROLE       IS '角色:STUDENT/ADMIN —— 规避 ROLE 保留字';
COMMENT ON COLUMN T_APP_USER.ACCOUNT_STATUS  IS '状态:ACTIVE/BANNED —— 规避 STATUS 保留字';
COMMENT ON COLUMN T_APP_USER.LAST_LOGIN_TIME IS '最近登录时间';
COMMENT ON COLUMN T_APP_USER.CREATE_TIME     IS '创建时间';
COMMENT ON COLUMN T_APP_USER.UPDATE_TIME     IS '更新时间';

-- 花名唯一索引（一键投胎去重依赖）
CREATE UNIQUE INDEX IDX_USER_NICKNAME   ON T_APP_USER(NICKNAME);
-- 学号索引（传统登录查询）
CREATE UNIQUE INDEX IDX_USER_STUDENT_ID ON T_APP_USER(STUDENT_ID);
```

### 4.2 菜品档口表

```sql
-- =============================================
-- 菜品档口表
-- =============================================
CREATE TABLE T_CAMPUS_DISH (
    ID              BIGINT IDENTITY(1,1) NOT NULL,
    DISH_NAME       VARCHAR(100)  NOT NULL,
    STALL_NAME      VARCHAR(100)  NOT NULL,
    CANTEEN_NAME    VARCHAR(100)  NOT NULL,
    FLOOR_NUM       INT           DEFAULT 1,
    PRICE           DECIMAL(10,2) DEFAULT 0.00,
    IMAGE_URL       VARCHAR(500),
    AVG_RATING      DECIMAL(3,2)  DEFAULT 0.00,
    REVIEW_COUNT    INT           DEFAULT 0,
    WEIGHT_FACTOR   DECIMAL(5,2)  DEFAULT 1.00,
    DISH_STATUS     VARCHAR(20)   DEFAULT 'ACTIVE',
    SUBMIT_USER_ID  BIGINT,
    CREATE_TIME     TIMESTAMP     DEFAULT SYSDATE,
    UPDATE_TIME     TIMESTAMP     DEFAULT SYSDATE,
    PRIMARY KEY (ID)
);

COMMENT ON TABLE  T_CAMPUS_DISH IS '菜品档口表';
COMMENT ON COLUMN T_CAMPUS_DISH.ID             IS '主键ID';
COMMENT ON COLUMN T_CAMPUS_DISH.DISH_NAME      IS '菜品名称';
COMMENT ON COLUMN T_CAMPUS_DISH.STALL_NAME     IS '档口名称';
COMMENT ON COLUMN T_CAMPUS_DISH.CANTEEN_NAME   IS '所属食堂';
COMMENT ON COLUMN T_CAMPUS_DISH.FLOOR_NUM      IS '所在楼层';
COMMENT ON COLUMN T_CAMPUS_DISH.PRICE          IS '价格';
COMMENT ON COLUMN T_CAMPUS_DISH.IMAGE_URL      IS '菜品图片地址';
COMMENT ON COLUMN T_CAMPUS_DISH.AVG_RATING     IS '平均评分(1-5)';
COMMENT ON COLUMN T_CAMPUS_DISH.REVIEW_COUNT   IS '评论总数';
COMMENT ON COLUMN T_CAMPUS_DISH.WEIGHT_FACTOR  IS '转盘权重系数';
COMMENT ON COLUMN T_CAMPUS_DISH.DISH_STATUS    IS '状态:ACTIVE/HIDDEN —— 规避 STATUS 保留字';
COMMENT ON COLUMN T_CAMPUS_DISH.SUBMIT_USER_ID IS '提交者用户ID';
COMMENT ON COLUMN T_CAMPUS_DISH.CREATE_TIME    IS '创建时间';
COMMENT ON COLUMN T_CAMPUS_DISH.UPDATE_TIME    IS '更新时间';

-- 按食堂+楼层查询常用索引
CREATE INDEX IDX_DISH_CANTEEN ON T_CAMPUS_DISH(CANTEEN_NAME, FLOOR_NUM);
-- 红黑榜排序索引
CREATE INDEX IDX_DISH_RATING  ON T_CAMPUS_DISH(AVG_RATING DESC);
```

### 4.3 毒舌评论表

```sql
-- =============================================
-- 毒舌评论表
-- =============================================
CREATE TABLE T_DISH_COMMENT (
    ID              BIGINT IDENTITY(1,1) NOT NULL,
    DISH_ID         BIGINT        NOT NULL,
    USER_ID         BIGINT        NOT NULL,
    RATING          INT           NOT NULL,
    CONTENT         VARCHAR(2000),
    ROAST_TEXT      VARCHAR(500),
    COMMENT_TAGS    VARCHAR(200),
    IS_ANONYMOUS    INT           DEFAULT 0,
    LIKE_COUNT      INT           DEFAULT 0,
    REPORT_COUNT    INT           DEFAULT 0,
    COMMENT_STATUS  VARCHAR(20)   DEFAULT 'ACTIVE',
    CREATE_TIME     TIMESTAMP     DEFAULT SYSDATE,
    PRIMARY KEY (ID)
);

COMMENT ON TABLE  T_DISH_COMMENT IS '毒舌评论表';
COMMENT ON COLUMN T_DISH_COMMENT.ID             IS '主键ID';
COMMENT ON COLUMN T_DISH_COMMENT.DISH_ID        IS '关联菜品ID';
COMMENT ON COLUMN T_DISH_COMMENT.USER_ID        IS '评论者用户ID';
COMMENT ON COLUMN T_DISH_COMMENT.RATING         IS '评分(1-5)';
COMMENT ON COLUMN T_DISH_COMMENT.CONTENT        IS '评论内容';
COMMENT ON COLUMN T_DISH_COMMENT.ROAST_TEXT     IS '系统生成的毒舌文案';
COMMENT ON COLUMN T_DISH_COMMENT.COMMENT_TAGS   IS '标签(逗号分隔):黑暗料理/性价比战神/排队王/食堂刺客';
COMMENT ON COLUMN T_DISH_COMMENT.IS_ANONYMOUS   IS '是否匿名:0-否,1-是';
COMMENT ON COLUMN T_DISH_COMMENT.LIKE_COUNT     IS '点赞数';
COMMENT ON COLUMN T_DISH_COMMENT.REPORT_COUNT   IS '被举报次数';
COMMENT ON COLUMN T_DISH_COMMENT.COMMENT_STATUS IS '状态:ACTIVE/HIDDEN/DELETED —— 规避 STATUS 保留字';
COMMENT ON COLUMN T_DISH_COMMENT.CREATE_TIME   IS '创建时间';

CREATE INDEX IDX_COMMENT_DISH   ON T_DISH_COMMENT(DISH_ID);
CREATE INDEX IDX_COMMENT_USER   ON T_DISH_COMMENT(USER_ID);
-- 举报查询索引
CREATE INDEX IDX_COMMENT_REPORT ON T_DISH_COMMENT(REPORT_COUNT DESC, COMMENT_STATUS);
```

### 4.4 花名生成词库表

```sql
-- =============================================
-- 花名生成词库表（用于自动生成沙雕昵称）
-- =============================================
CREATE TABLE T_NICKNAME_POOL (
    ID          BIGINT IDENTITY(1,1) NOT NULL,
    ADJECTIVE   VARCHAR(50) NOT NULL,
    FOOD_NAME   VARCHAR(50) NOT NULL,
    PRIMARY KEY (ID)
);

COMMENT ON TABLE  T_NICKNAME_POOL IS '花名生成词库表';
COMMENT ON COLUMN T_NICKNAME_POOL.ADJECTIVE IS '形容词:暴躁的/emo的/摆烂的/怀民亦未寝的';
COMMENT ON COLUMN T_NICKNAME_POOL.FOOD_NAME IS '食物名:黄焖鸡/麻辣香锅/螺蛳粉/奶茶';

-- 预置词库数据
INSERT INTO T_NICKNAME_POOL(ADJECTIVE, FOOD_NAME) VALUES
('暴躁的', '黄焖鸡'), ('emo的', '麻辣香锅'), ('摆烂的', '螺蛳粉'),
('怀民亦未寝的', '烤冷面'), ('45度角的', '奶茶'), ('纯爱的', '炸鸡排'),
('绝绝子的', '石锅拌饭'), ('社恐的', '麻辣烫'), ('带带', '大师兄'),
('小丑', '竟是我自己'), ('重生之我是', '食堂阿姨'), ('早八', '困死我了'),
('学分', '绩点杀手'), ('体测', '及格线'), ('宿舍', '守夜人');
```

---

## 5. 后端核心业务实现 (Backend Java Code)

### 5.1 JWT 令牌工具类

```java
package com.campus.eatpicker.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // 生产环境请从配置中心拉取，不要硬编码在代码里
    private static final String SECRET = "WhatToEatWheel2024CampusSecretKey_HopeYouEatWell";
    private static final long EXPIRE_MS = 1000L * 60 * 60 * 24 * 7; // 7 天过期

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * 生成 JWT Token
     * @param userId   用户 ID
     * @param nickname 花名
     * @param userRole 角色（STUDENT/ADMIN，塞进 payload 供 AdminInterceptor 做 RBAC）
     */
    public String generateToken(Long userId, String nickname, String userRole) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("nickname", nickname);
        claims.put("userRole", userRole);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从 Token 中解析 Claims
     */
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 校验 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从 Token 中提取 userId（空值容错 + 类型安全擦除）
     * 高并发反序列化场景下 claims 可能为 null，先取 Object 再安全转换，杜绝 NPE
     */
    public Long getUserId(String token) {
        Object sub = parseToken(token).getSubject();
        return sub != null ? Long.valueOf(sub.toString()) : null;
    }

    /**
     * 从 Token 中提取 nickname（空值容错 + 类型安全擦除）
     * 缺省返回 "匿名食客"，防止脏 claims 导致隐式强转 ClassCastException
     */
    public String getNickname(String token) {
        Object nick = parseToken(token).get("nickname");
        return nick != null ? nick.toString() : "匿名食客";
    }

    /**
     * 从 Token 中提取 userRole（管理员 RBAC 依赖）
     * 空值容错：claims 缺失或类型异常时缺省返回 STUDENT，
     * 彻底消除高并发下 claims.get("userRole") 隐式強转 ClassCastException 与空指针异常
     */
    public String getUserRole(String token) {
        Object role = parseToken(token).get("userRole");
        return role != null ? role.toString() : "STUDENT";
    }
}
```

### 5.2 JWT 拦截器（自动从 Header 提取用户身份）

```java
package com.campus.eatpicker.config;

import com.campus.eatpicker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        // 放行 OPTIONS 预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(401);
            return false;
        }

        // 将 userId、nickname、userRole 写入 request attribute
        request.setAttribute("userId", jwtUtil.getUserId(token));
        request.setAttribute("nickname", jwtUtil.getNickname(token));
        request.setAttribute("userRole", jwtUtil.getUserRole(token));
        return true;
    }
}
```

### 5.2b AdminInterceptor —— 管理员 RBAC 拦截器

```java
package com.campus.eatpicker.config;

import com.campus.eatpicker.common.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 管理员权限拦截器 —— 双层拦截器网关第二层
 *
 * 在 JwtInterceptor 已完成身份认证的基础上，
 * 校验 request attribute 中 userRole 是否为 ADMIN。
 * 非管理员访问 /api/admin/** 一律返回 403 JSON。
 */
@Component
@RequiredArgsConstructor
public class AdminInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws IOException {
        String userRole = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(userRole)) {
            response.setStatus(403);
            response.setContentType("application/json;charset=UTF-8");
            Result<Void> error = Result.error(403,
                    "权限不足：本接口仅对食堂管理员开放。请联系超级管理员，手动执行 UPDATE T_APP_USER SET USER_ROLE='ADMIN' WHERE ID=你的ID 升权。");
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return false;
        }
        return true;
    }
}
```

### 5.2c WebConfig —— 双层拦截器注册

```java
package com.campus.eatpicker.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;
    private final AdminInterceptor adminInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 第一层：JWT 身份认证（放行投胎/登录/转盘）
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/quick-register",
                        "/api/auth/login",
                        "/api/wheel/spin"
                );

        // 第二层：管理员 RBAC（仅拦截 /api/admin/**）
        registry.addInterceptor(adminInterceptor)
                .addPathPatterns("/api/admin/**");
    }

    /**
     * 全局 CORS 跨域盾牌 —— 支持前后端多端口分离联调
     *
     * 允许所有来源（开发/生产多域名场景），开放全部 HTTP 方法，
     * 显式暴露 Authorization 头（JWT 透传依赖），预检缓存 1 小时
     * 以大幅降低 OPTIONS 预检请求对达梦底座造成的并发 QPS 损耗。
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 5.3 AuthController —— 一键投胎 + 登录接口

```java
package com.campus.eatpicker.controller;

import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;
import com.campus.eatpicker.service.UserService;
import com.campus.eatpicker.util.JwtUtil;
import com.campus.eatpicker.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * 🎲 一键投胎 —— 无需手机号、无需邮箱、无需学号
     * 后端从花名词库随机抽取形容词 + 食物名拼成唯一花名，
     * 写入 DB 后用 IDENTITY 自增主键作为 userId，返回 JWT。
     *
     * 调用即注册，注册即登录。拒绝一切繁琐流程。
     */
    @PostMapping("/quick-register")
    public Result<AuthResultDTO> quickRegister() {
        // 1. 随机生成花名 + 写入数据库
        AuthResultDTO result = userService.quickRegister();
        // 2. 签发 JWT
        String token = jwtUtil.generateToken(result.getUserId(), result.getNickname(), result.getUserRole());
        result.setToken(token);
        return Result.success(result);
    }

    /**
     * 📖 老怨种回归 —— 传统学号+密码登录
     * 适用于绑定了学号的老用户，或者想正经登录的体面人。
     */
    @PostMapping("/login")
    public Result<AuthResultDTO> login(@RequestBody LoginRequestDTO request) {
        AuthResultDTO result = userService.login(request);
        String token = jwtUtil.generateToken(result.getUserId(), result.getNickname(), result.getUserRole());
        result.setToken(token);
        return Result.success(result);
    }
}
```

### 5.4 Auth 相关 DTO

```java
package com.campus.eatpicker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResultDTO {
    private Long userId;
    private String nickname;
    private String userRole;         // STUDENT / ADMIN（JWT payload + 前端菜单判断）
    private String avatarUrl;
    private String token;           // JWT Token

    /**
     * 返回给前端的入场文案（每次投胎随机挑选一句，增加仪式感）
     */
    private String welcomeMessage;
}
```

```java
package com.campus.eatpicker.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String studentId;       // 学号
    private String password;        // 密码
}
```

### 5.5 通用响应体

```java
package com.campus.eatpicker.common;

import lombok.Data;

@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = 0;
        r.message = "ok";
        r.data = data;
        return r;
    }

    public static <T> Result<T> error(int code, String message) {
        Result<T> r = new Result<>();
        r.code = code;
        r.message = message;
        return r;
    }
}
```

### 5.6 UserService 接口

```java
package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;

public interface UserService {

    /**
     * 一键投胎：随机生成花名 + 写入用户表 + 返回身份信息
     */
    AuthResultDTO quickRegister();

    /**
     * 传统登录：学号 + 密码验证
     */
    AuthResultDTO login(LoginRequestDTO request);
}
```

### 5.7 UserServiceImpl —— 一键投胎核心业务逻辑

```java
package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.dto.AuthResultDTO;
import com.campus.eatpicker.dto.LoginRequestDTO;
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

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AppUserMapper appUserMapper;
    private final NicknamePoolMapper nicknamePoolMapper;

    // 一键投胎的默认密码，用 BCrypt 哈希后存储
    private static final String DEFAULT_PASSWORD = "EatOrNot666";

    // 开场白词库 —— 每次投胎成功后随机抽一句，纯纯仪式感
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
        //    废弃 ORDER BY RANDOM()（全表扫描 + CPU 飙升至 100%），
        //    也废弃 LIMIT 1 OFFSET（部分达梦驱动方言转换失败），
        //    统一使用达梦原生 ROWNUM + OFFSET，15 条也按大厂高并发标准写
        long total = nicknamePoolMapper.selectCount(null);
        if (total == 0) {
            return buildFallbackUser();
        }
        long randomOffset = ThreadLocalRandom.current().nextLong(total);
        LambdaQueryWrapper<NicknamePool> wrapper = new LambdaQueryWrapper<>();
        wrapper.last("AND ROWNUM = 1 OFFSET " + randomOffset);
        NicknamePool pool = nicknamePoolMapper.selectOne(wrapper);

        if (pool == null) {
            // 极端兜底：词库空了，用硬编码的备用词
            return buildFallbackUser();
        }

        String adjective = pool.getAdjective();
        String foodName = pool.getFoodName();
        String rawNickname = adjective + foodName;

        // 2. 花名去重 —— 如果撞名，在末尾追加随机 3 位数字
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
                .userId(user.getId())          // ← 达梦 IDENTITY 自动回填的 id
                .nickname(user.getNickname())
                .userRole(user.getUserRole())
                .avatarUrl(user.getAvatarUrl())
                .welcomeMessage(welcome)
                .build();
    }

    /**
     * 确保花名唯一：达梦大小写敏感场景下精确查询
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
}
```

### 5.8 AppUser 实体类（达梦适配）

```java
package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

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

    @TableField("USER_PWD")           // ← 非 PASSWORD，规避保留字；全版本通杀
    private String password;

    @TableField("USER_ROLE")          // ← 非 ROLE，规避保留字
    private String userRole;

    @TableField("ACCOUNT_STATUS")     // ← 非 STATUS，规避保留字
    private String accountStatus;

    @TableField("LAST_LOGIN_TIME")
    private Date lastLoginTime;

    @TableField("CREATE_TIME")
    private Date createTime;

    @TableField("UPDATE_TIME")
    private Date updateTime;
}
```

### 5.9 NicknamePool 实体类

```java
package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

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
```

### 5.10 AppUserMapper 与 NicknamePoolMapper

```java
package com.campus.eatpicker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.eatpicker.entity.AppUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AppUserMapper extends BaseMapper<AppUser> {
}
```

```java
package com.campus.eatpicker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.eatpicker.entity.NicknamePool;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NicknamePoolMapper extends BaseMapper<NicknamePool> {
}
```

### 5.11 全局异常处理（让 RuntimeException 返回友好 JSON）

```java
package com.campus.eatpicker.config;

import com.campus.eatpicker.common.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntime(RuntimeException e) {
        return Result.error(400, e.getMessage());
    }
}
```

---

### 5.12 AdminController —— 安全管理后台

```java
package com.campus.eatpicker.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.campus.eatpicker.common.Result;
import com.campus.eatpicker.entity.AppUser;
import com.campus.eatpicker.entity.CampusDish;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.AppUserMapper;
import com.campus.eatpicker.mapper.CampusDishMapper;
import com.campus.eatpicker.mapper.DishCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CampusDishMapper dishMapper;
    private final DishCommentMapper commentMapper;
    private final AppUserMapper userMapper;

    // ─── 菜品管理 ────────────────────────────

    /**
     * 新增菜品（管理员手动录入转盘池）
     */
    @PostMapping("/dish")
    public Result<CampusDish> createDish(@RequestBody CampusDish dish) {
        dish.setDishStatus("ACTIVE");
        dish.setCreateTime(new Date());
        dish.setUpdateTime(new Date());
        if (dish.getWeightFactor() == null) {
            dish.setWeightFactor(BigDecimal.ONE);
        }
        dishMapper.insert(dish);
        return Result.success(dish);
    }

    /**
     * 更新菜品（调整权重因子、价格、名称等）
     */
    @PutMapping("/dish")
    public Result<CampusDish> updateDish(@RequestBody CampusDish dish) {
        dish.setUpdateTime(new Date());
        dishMapper.updateById(dish);
        return Result.success(dishMapper.selectById(dish.getId()));
    }

    /**
     * 下架菜品（软删除，状态置为 HIDDEN，不再出现在转盘中）
     */
    @DeleteMapping("/dish/{id}")
    public Result<Void> deleteDish(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<CampusDish> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(CampusDish::getDishStatus, "HIDDEN")
               .set(CampusDish::getUpdateTime, new Date())
               .eq(CampusDish::getId, id);
        dishMapper.update(null, wrapper);
        return Result.success(null);
    }

    // ─── 评论管理 ────────────────────────────

    /**
     * 拉取被举报次数 >= 1 的恶评列表（按举报次数倒序）
     */
    @GetMapping("/comment/reported")
    public Result<List<DishComment>> listReportedComments() {
        LambdaQueryWrapper<DishComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(DishComment::getReportCount, 1)
               .eq(DishComment::getCommentStatus, "ACTIVE")
               .orderByDesc(DishComment::getReportCount);
        return Result.success(commentMapper.selectList(wrapper));
    }

    /**
     * 正义斩杀 —— 将评论状态变更为 HIDDEN
     */
    @DeleteMapping("/comment/{id}")
    public Result<Void> hideComment(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<DishComment> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(DishComment::getCommentStatus, "HIDDEN")
               .eq(DishComment::getId, id);
        commentMapper.update(null, wrapper);
        return Result.success(null);
    }

    // ─── 用户管理 ────────────────────────────

    /**
     * 封印此魂 —— 封禁指定用户账号
     */
    @PostMapping("/user/ban/{id}")
    public Result<Void> banUser(@PathVariable("id") Long id) {
        LambdaUpdateWrapper<AppUser> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(AppUser::getAccountStatus, "BANNED")
               .set(AppUser::getUpdateTime, new Date())
               .eq(AppUser::getId, id);
        userMapper.update(null, wrapper);
        return Result.success(null);
    }
}
```

---

### 5.13 WheelService 接口

```java
package com.campus.eatpicker.service;

import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.dto.SpinRequestDTO;
import java.util.List;

/**
 * 大转盘核心服务
 */
public interface WheelService {

    /**
     * 执行加权随机抽取，返回命中的菜品及毒舌文案
     */
    WheelResultDTO spin(SpinRequestDTO request);

    /**
     * 拉取当前可参与转盘的菜品列表（带权重）
     */
    List<WheelResultDTO> getCandidateDishes(Long canteenId);
}
```

### 5.14 WheelServiceImpl —— 加权随机 + 毒舌文案生成

```java
package com.campus.eatpicker.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.eatpicker.entity.CampusDish;
import com.campus.eatpicker.entity.DishComment;
import com.campus.eatpicker.mapper.CampusDishMapper;
import com.campus.eatpicker.mapper.DishCommentMapper;
import com.campus.eatpicker.dto.WheelResultDTO;
import com.campus.eatpicker.dto.SpinRequestDTO;
import com.campus.eatpicker.service.WheelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WheelServiceImpl implements WheelService {

    private final CampusDishMapper dishMapper;
    private final DishCommentMapper commentMapper;

    @Override
    public WheelResultDTO spin(SpinRequestDTO request) {
        // 1. 拉取候选菜品
        LambdaQueryWrapper<CampusDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CampusDish::getDishStatus, "ACTIVE");  // ← DISH_STATUS，非 STATUS
        if (request.getCanteenName() != null && !request.getCanteenName().isBlank()) {
            wrapper.eq(CampusDish::getCanteenName, request.getCanteenName());
        }
        List<CampusDish> dishes = dishMapper.selectList(wrapper);
        if (dishes.isEmpty()) {
            return WheelResultDTO.fallback("食堂还没开门，你先饿着吧。");
        }

        // 2. 计算每条菜品的转盘权重
        List<WeightedItem> items = dishes.stream()
                .map(d -> new WeightedItem(d, computeWeight(d)))
                .collect(Collectors.toList());

        // 3. 加权随机抽取
        WeightedItem picked = weightedRandomPick(items);

        // 4. 生成毒舌文案
        String roastText = generateRoastText(picked.dish);

        // 5. 组装返回
        return WheelResultDTO.builder()
                .dishId(picked.dish.getId())
                .dishName(picked.dish.getDishName())
                .stallName(picked.dish.getStallName())
                .canteenName(picked.dish.getCanteenName())
                .price(picked.dish.getPrice())
                .imageUrl(picked.dish.getImageUrl())
                .avgRating(picked.dish.getAvgRating())
                .roastText(roastText)
                .build();
    }

    // ─── 权重计算 ───────────────────────────────────────

    /**
     * 权重计算策略：
     * - 低分菜（avgRating < 2.5）：权重 × 3.0 —— 很难吃不等于你就不该再吃一次
     * - 高分爆款（avgRating >= 4.0）：权重 × 1.5 —— 白月光值得反复
     * - 已有黑榜热度的菜品：权重 × 2.0 —— 越多人骂越应该被抽到
     * - 价格刺客（price > 35）：权重 × 0.3 —— 不能真把你往破产了送
     * - 评分处于 2.5~3.9 的"平庸菜"：权重 = 基础值（1.0）—— 抽到算你倒霉
     */
    private double computeWeight(CampusDish dish) {
        double baseWeight = dish.getWeightFactor() != null ? dish.getWeightFactor().doubleValue() : 1.0;
        double rating = dish.getAvgRating() != null ? dish.getAvgRating().doubleValue() : 3.0;
        double price = dish.getPrice() != null ? dish.getPrice().doubleValue() : 10.0;
        double reviewCount = dish.getReviewCount() != null ? dish.getReviewCount().doubleValue() : 0;

        double multiplier = 1.0;

        if (rating < 2.5) {
            multiplier = 3.0;      // 黑暗料理：让你再遭一次罪
        } else if (rating >= 4.0) {
            multiplier = 1.5;      // 白月光：值得反复抽
        }

        if (reviewCount >= 20 && rating < 3.0) {
            multiplier = Math.max(multiplier, 2.0); // 黑榜热度加持
        }

        if (price > 35.0) {
            multiplier *= 0.3;     // 刺客保护机制
        }

        return baseWeight * multiplier;
    }

    // ─── 加权随机算法 ──────────────────────────────────

    private WeightedItem weightedRandomPick(List<WeightedItem> items) {
        double totalWeight = items.stream().mapToDouble(i -> i.weight).sum();
        double random = ThreadLocalRandom.current().nextDouble() * totalWeight;
        double cumulative = 0.0;
        for (WeightedItem item : items) {
            cumulative += item.weight;
            if (random <= cumulative) {
                return item;
            }
        }
        return items.get(items.size() - 1); // Fallback: 返回最后一个
    }

    // ─── 毒舌文案生成 ──────────────────────────────────

    private static final List<String> HIGH_SCORE_TEMPLATES = List.of(
            "此物只应天上有，食堂能做出这个水平，阿姨今天心情一定不错。",
            "这是食堂的良心发现之作，建议趁阿姨还没离职多吃几顿。",
            "你的运气不错，这是全校投票的 TOP 选手，吃完记得给学长学姐磕一个。",
            "抽到它，说明你今天的人品余额还没透支。趁热吃，别刷手机了。"
    );

    private static final List<String> LOW_SCORE_TEMPLATES = List.of(
            "命运在嘲笑你。这道菜的含金量是——含金量为零。",
            "恭喜！你即将解锁「食堂求生」成就。建议搭配老干妈食用。",
            "用两个字形容这道菜：活着。再多一个词：勉强活着。",
            "这不是菜，这是食堂对食物的致敬。建议闭眼吃，减少视觉伤害。",
            "这道菜的主厨可能跟食材有仇。你要是不信邪，就去试试。"
    );

    private static final List<String> EXPENSIVE_TEMPLATES = List.of(
            "价格很美丽，味道很骨感。这一顿够你在外面吃顿火锅了。",
            "食堂刺客，不讲武德。建议先看看余额再张嘴。",
            "这个价位的菜，味道应该是米其林级别的——但它明显不是。"
    );

    private static final List<String> PLAIN_TEMPLATES = List.of(
            "不好吃，也不难吃。它存在的意义就是帮你活着。",
            "吃了跟没吃差不多，属于食堂气氛组选手。",
            "没什么记忆点的菜，但起码不会让你后悔到今晚。",
            "它是食堂里最稳定的存在——稳定地平庸，稳定地饱腹。",
            "这道菜就像你的水课：有它也行，没有更好。"
    );

    /**
     * 根据评分和价格动态生成毒舌文案
     */
    private String generateRoastText(CampusDish dish) {
        double rating = dish.getAvgRating() != null ? dish.getAvgRating().doubleValue() : 3.0;
        double price = dish.getPrice() != null ? dish.getPrice().doubleValue() : 10.0;

        List<String> pool;
        if (rating >= 4.0) {
            pool = HIGH_SCORE_TEMPLATES;
        } else if (rating < 2.5) {
            pool = LOW_SCORE_TEMPLATES;
        } else if (price > 35.0) {
            pool = EXPENSIVE_TEMPLATES;
        } else {
            pool = PLAIN_TEMPLATES;
        }

        // 随机取一条 + 加菜品名，提升个性化
        int idx = ThreadLocalRandom.current().nextInt(pool.size());
        String template = pool.get(idx);

        // 低分菜追加伤害
        if (rating < 2.5 && ThreadLocalRandom.current().nextDouble() < 0.3) {
            template += " 上次吃这个的人已经三天没来食堂了。";
        }

        return String.format("「%s」—— %s", dish.getDishName(), template);
    }

    // ─── 内部类 ────────────────────────────────────────

    private static class WeightedItem {
        final CampusDish dish;
        final double weight;

        WeightedItem(CampusDish dish, double weight) {
            this.dish = dish;
            this.weight = weight;
        }
    }
}
```

### 5.15 转盘相关 DTO

```java
package com.campus.eatpicker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WheelResultDTO {
    private Long dishId;
    private String dishName;
    private String stallName;
    private String canteenName;
    private Double price;
    private String imageUrl;
    private Double avgRating;
    private String roastText;       // 毒舌文案
    private String fallbackMessage; // 兜底文案（无菜品时）

    public static WheelResultDTO fallback(String msg) {
        return WheelResultDTO.builder().fallbackMessage(msg).build();
    }
}
```

```java
package com.campus.eatpicker.dto;

import lombok.Data;

@Data
public class SpinRequestDTO {
    private String canteenName;  // 可选：限定食堂
}
```

---

## 6. 前端大转盘组件 (Frontend React Component)

### 6.1 API 请求封装与 JWT 拦截透传

```js
// src/utils/api.js

const BASE_URL = "/api";

/**
 * 从 LocalStorage 读取 Token
 */
function getToken() {
  return localStorage.getItem("eat_token") || "";
}

/**
 * 保存用户信息到 LocalStorage
 */
export function saveAuth(token, user) {
  localStorage.setItem("eat_token", token);
  localStorage.setItem("eat_user", JSON.stringify(user));
}

/**
 * 读取用户信息
 */
export function getAuthUser() {
  try {
    const raw = localStorage.getItem("eat_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * 清除登录状态（投胎失败？重新投）
 */
export function clearAuth() {
  localStorage.removeItem("eat_token");
  localStorage.removeItem("eat_user");
}

/**
 * 带 JWT 的统一 fetch 封装
 */
export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // JWT 拦截透传：如果有 Token 就挂 Authorization 头
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 🔥 Token 过期熔断守卫 —— 401 清空脏数据 + 重回投胎页面
  //    ⚠️ 白名单豁免：一键投胎 / 登录接口本身返回 401 属于业务拒绝，
  //    绝非 Token 过期，严禁触发 reload() 导致死循环刷屏
  if (res.status === 401) {
    const isAuthEndpoint =
      path.includes("/auth/quick-register") ||
      path.includes("/auth/login");
    if (isAuthEndpoint) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "认证失败，请检查身份信息后重试");
    }
    clearAuth();
    window.location.reload();
    return;
  }

  const data = await res.json();

  if (!res.ok || data.code !== 0) {
    throw new Error(data.message || "请求失败，食堂网络可能又崩了");
  }

  return data;
}
```

### 6.2 AuthModal —— 一键投胎 / 老怨种回归双视角弹窗

```jsx
// src/components/AuthModal.jsx
import React, { useState } from "react";
import { api, saveAuth, getAuthUser, clearAuth } from "../utils/api";

/**
 * 全局投胎认证弹窗
 *
 * 双视角切换：
 *  - 'reincarnation' : 一键投胎（随机花名，免密注册即登录）
 *  - 'login'         : 老怨种回归（学号 + 密码）
 *
 * 调用方式：<AuthModal onClose={fn} onAuthSuccess={fn} />
 */
export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("reincarnation"); // reincarnation | login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 登录表单状态
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  // ─── 一键投胎 ──────────────────────────
  const handleQuickRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/auth/quick-register", { method: "POST" });
      const { token, userId, nickname, userRole, welcomeMessage } = res.data;

      saveAuth(token, { userId, nickname, userRole });
      onAuthSuccess?.({ userId, nickname, userRole, welcomeMessage });
      onClose?.();
    } catch (err) {
      setError(err.message || "投胎失败，食堂命运之神不在线。再试一次？");
    } finally {
      setLoading(false);
    }
  };

  // ─── 传统登录 ──────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!studentId.trim() || !password.trim()) {
      setError("学号和密码总得填一下吧？");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ studentId: studentId.trim(), password }),
      });
      const { token, userId, nickname, userRole, welcomeMessage } = res.data;

      saveAuth(token, { userId, nickname, userRole });
      onAuthSuccess?.({ userId, nickname, userRole, welcomeMessage });
      onClose?.();
    } catch (err) {
      setError(err.message || "登录失败，检查一下学号密码？");
    } finally {
      setLoading(false);
    }
  };

  // ─── 已登录状态 ────────────────────────
  const currentUser = getAuthUser();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden
                      animate-[slideUp_0.4s_ease-out]">

        {/* ── 顶部渐变条 ── */}
        <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" />

        <div className="p-6">
          {/* ── 标题 ── */}
          <h2 className="text-xl font-extrabold text-gray-900 text-center mb-1">
            {currentUser ? "你已投胎成功" : "欢迎来到食堂吃瓜一线"}
          </h2>
          <p className="text-xs text-gray-400 text-center mb-5">
            {currentUser
              ? `当前身份：${currentUser.nickname}`
              : "选一种方式进入，然后开始转盘和点评"}
          </p>

          {/* ── 已登录：显示信息 + 退出 ── */}
          {currentUser ? (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-3xl mb-2">🍜</p>
                <p className="text-sm text-purple-700 font-bold">
                  {currentUser.nickname}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  你的花名已刻入食堂族谱
                </p>
              </div>
              <button
                onClick={() => {
                  clearAuth();
                  onClose?.();
                }}
                className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl
                           text-sm hover:bg-gray-200 active:scale-95 transition-all"
              >
                退出登录，重新投胎
              </button>
            </div>
          ) : (
            <>
              {/* ── 模式切换 Tab ── */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
                <button
                  onClick={() => { setMode("reincarnation"); setError(""); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${mode === "reincarnation"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-500"}`}
                >
                  🎲 一键投胎
                </button>
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${mode === "login"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-500"}`}
                >
                  📖 老怨种回归
                </button>
              </div>

              {/* ── 一键投胎面板 ── */}
              {mode === "reincarnation" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50
                                  rounded-xl p-5 text-center space-y-3">
                    <p className="text-4xl">🎰</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      系统会随机给你分配一个<strong>沙雕花名</strong>
                      <br />
                      无需手机号、无需邮箱、无需学号
                      <br />
                      <span className="text-purple-500 font-bold">
                        真正的「一键投胎」
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      花名一旦生成不可修改（30 天内）
                      <br />
                      请珍惜你的食生
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-500 text-xs text-center
                                    py-2 rounded-lg">{error}</div>
                  )}

                  <button
                    onClick={handleQuickRegister}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500
                               text-white text-lg font-bold rounded-xl shadow-lg
                               hover:from-purple-600 hover:to-pink-600
                               active:scale-95 disabled:opacity-50
                               transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent
                                       rounded-full animate-spin" />
                        投胎中...
                      </span>
                    ) : (
                      "🎲 随机分配花名，开吃！"
                    )}
                  </button>
                </div>
              )}

              {/* ── 传统登录面板 ── */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      学号
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="20241001001"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200
                                 rounded-xl text-sm focus:outline-none focus:border-purple-400
                                 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      密码
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入你的密码"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200
                                 rounded-xl text-sm focus:outline-none focus:border-purple-400
                                 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-500 text-xs text-center
                                    py-2 rounded-lg">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500
                               text-white text-lg font-bold rounded-xl shadow-lg
                               hover:from-purple-600 hover:to-indigo-600
                               active:scale-95 disabled:opacity-50
                               transition-all duration-200"
                  >
                    {loading ? "登录中..." : "📖 老怨种回归"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    还没账号？切到「一键投胎」免费领花名
                  </p>
                </form>
              )}
            </>
          )}
        </div>

        {/* ── 关闭按钮（仅未登录时显示） ── */}
        {!currentUser && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
                       bg-gray-100 text-gray-400 rounded-full text-sm
                       hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

### 6.3 FoodWheel —— fetch-first-then-animate 大转盘组件

```jsx
import React, { useState, useRef, useCallback, useEffect } from "react";

/**
 * 校园"今天吃什么"大转盘组件
 *
 * 核心时序：点击 → 立即请求API → 等待期间匀速自转 → API返回 → 计算目标角度 → 减速停靠
 * 杜绝"前端假转、后端定结果"的时序竞态。无论网络多卡，动画始终丝滑。
 */
export default function FoodWheel({ dishes = [], onSpinResult }) {
  const [phase, setPhase] = useState("idle");    // idle | loading | decelerating | done
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showCard, setShowCard] = useState(false);

  // 匀速自转动画帧控制
  const animFrameRef = useRef(null);
  const spinSpeedRef = useRef(0);                 // 当前转速 (度/帧)
  const isMounted = useRef(true);                 // 组件存活守卫：切页卸载后阻断所有异步回调

  const SEGMENT_COLORS = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA",
  ];

  // 每段的角度跨度
  const segmentDeg = dishes.length > 0 ? 360 / dishes.length : 0;

  // ─── 匀速自转循环 ──────────────────────
  useEffect(() => {
    if (phase !== "loading") {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    spinSpeedRef.current = 4; // 匀速 4 度/帧 ≈ 240 度/秒

    const tick = () => {
      if (!isMounted.current) return; // 切页卸载保护
      setRotation((prev) => (prev + spinSpeedRef.current) % 360); // 模 360 防溢出：阻断长周期浮点累加精度丢失
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  // ─── 组件卸载时将 isMounted 置为 false，阻断所有异步回调 ──
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ─── 点击抽签 ─────────────────────────
  const spin = useCallback(async () => {
    if (phase !== "idle" || dishes.length === 0) return;
    setShowCard(false);
    setResult(null);
    setPhase("loading");

    // 立刻请求后端，同时前端进入匀速自转等待态
    let pickedDish = null;
    try {
      const res = await fetch("/api/wheel/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.code === 0) {
        pickedDish = data.data;
      }
    } catch (_err) {
      // 降级：本地随机
      pickedDish = {
        ...dishes[Math.floor(Math.random() * dishes.length)],
        roastText: "系统开小差了，但命运替你选了它。认命吧。",
      };
    }

    if (!pickedDish) {
      if (isMounted.current) setPhase("idle");
      return;
    }

    if (!isMounted.current) return; // 切页保护：用户已离开，不操作 DOM
    setResult(pickedDish);

    // ─── 计算目标角度，执行减速停靠 ──────
    // 按 dishId 在 dishes 数组中定位该菜品在转盘上的扇区位置
    const targetIndex = dishes.findIndex(
      (d) => (d.id || d.dishId) === (pickedDish.dishId || pickedDish.id)
    );
    const idx = targetIndex >= 0 ? targetIndex : 0;

    // conic-gradient 默认从 3 点钟方向（0°）顺时针绘制，而物理指针悬挂在 12 点钟顶部。
    // 3 点钟 → 12 点钟的顺时针偏移 = 270°。必须精准补偿，否则指针永远对不齐扇区中心。
    const sectorCenter = idx * segmentDeg + segmentDeg / 2;
    const pointerOffset = 270; // 3 点钟 → 12 点钟顺时针 270° 补偿
    const targetStopAngle = (360 - sectorCenter + pointerOffset) % 360;

    // 当前 rotation 可能已经转了 N 圈，取归一化到 [0,360) 的当前朝向
    const currentNormalized = ((rotation % 360) + 360) % 360;
    // 从当前朝向到目标停止角，需要额外转的角度（取最短顺时针路径）
    let extraDeg = targetStopAngle - currentNormalized;
    if (extraDeg < 0) extraDeg += 360;
    // 至少再转 3 整圈 + extraDeg，保证视觉上减速有足够空间
    const fullSpins = 3 * 360;
    const finalAngle = rotation + fullSpins + extraDeg;

    // 结束匀速自转，执行减速停靠
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
    setPhase("decelerating");
    setRotation(finalAngle);

    // 等 CSS transition 完成后弹出卡片
    setTimeout(() => {
      if (!isMounted.current) return; // 切页保护：用户已离开，不弹出卡片
      setPhase("done");
      setShowCard(true);
      onSpinResult?.(pickedDish);
    }, 3800); // 与 CSS transition 3.5s + 余量对齐
  }, [phase, rotation, dishes, segmentDeg, onSpinResult]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-sm mx-auto px-4">
      {/* ── 转盘容器 ── */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80">
        {/* 指针（12 点钟方向） */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px]
                          border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
        </div>

        {/* 转盘本体 */}
        <div
          className="w-full h-full rounded-full border-4 border-amber-600 shadow-2xl overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition:
              phase === "decelerating" || phase === "done"
                ? "transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",           // loading 阶段匀速自转不用 CSS transition
            background: dishes.length > 0
              ? `conic-gradient(${dishes
                  .map(
                    (_, i) =>
                      `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]} ${
                        i * segmentDeg
                      }deg ${(i + 1) * segmentDeg}deg`
                  )
                  .join(", ")})`
              : "#e5e7eb",     // 空数组时纯灰底，防止 conic-gradient() 无参炸 CSS
          }}
        >
          {/* 菜品标签 */}
          {dishes.map((dish, i) => {
            const angle = i * segmentDeg + segmentDeg / 2;
            const rad = (angle * Math.PI) / 180;
            const r = 38;
            const x = 50 + r * Math.cos(rad - Math.PI / 2);
            const y = 50 + r * Math.sin(rad - Math.PI / 2);
            return (
              <span
                key={i}
                className="absolute text-white text-[10px] sm:text-xs font-bold
                           pointer-events-none whitespace-nowrap"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                {dish.dishName || dish.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── 旋转按钮 ── */}
      <button
        onClick={spin}
        disabled={phase !== "idle" || dishes.length === 0}
        className="mt-6 px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-500
                   text-white text-lg font-bold rounded-full shadow-lg
                   hover:from-amber-600 hover:to-orange-600
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
      >
        {phase === "loading" ? "命运转动中..." :
         phase === "decelerating" ? "即将揭晓..." :
         dishes.length === 0 ? "今儿没菜了" : "🎡 开始抽签"}
      </button>

      {/* ── 毒舌卡片弹窗 ── */}
      {showCard && result && (
        <RoastCard result={result} onClose={() => { setShowCard(false); setPhase("idle"); }} />
      )}
    </div>
  );
}
```

/**
 * 抽中后的毒舌点评卡片
 */
function RoastCard({ result, onClose }) {
  const ratingColor =
    (result.avgRating || 3) >= 4.0
      ? "text-green-500"
      : (result.avgRating || 3) < 2.5
        ? "text-red-500"
        : "text-yellow-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden
                    animate-[slideUp_0.4s_ease-out]"
      >
        {/* 顶部配色条 */}
        <div
          className={`h-2 ${(result.avgRating || 3) >= 4.0
              ? "bg-gradient-to-r from-green-400 to-emerald-400"
              : (result.avgRating || 3) < 2.5
                ? "bg-gradient-to-r from-red-400 to-pink-400"
                : "bg-gradient-to-r from-yellow-400 to-amber-400"
            }`}
        />

        <div className="p-6">
          {/* 菜品名 */}
          <h3 className="text-xl font-extrabold text-gray-900 text-center mb-1">
            {result.dishName}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            {result.stallName && `${result.stallName} · `}
            {result.price != null && `¥${result.price}`}
          </p>

          {/* 评分条 */}
          {result.avgRating != null && (
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${star <= Math.round(result.avgRating)
                      ? "text-amber-400"
                      : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
              <span className={`ml-2 font-bold text-lg ${ratingColor}`}>
                {result.avgRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* 毒舌文案 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
            <p className="text-gray-700 text-sm leading-relaxed italic">
              {result.roastText || "今天的命运没说啥，你自己看着办吧。"}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl
                         font-semibold text-sm hover:bg-gray-200 active:scale-95
                         transition-all duration-150"
            >
              我再抽一次
            </button>
            <a
              href={`#/dish/${result.dishId}`}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500
                         text-white rounded-xl font-semibold text-sm text-center
                         hover:from-amber-600 hover:to-orange-600 active:scale-95
                         transition-all duration-150"
            >
              我看点评
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.4 App.jsx —— 顶层全局投胎路由拦截网关

```jsx
// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getAuthUser, clearAuth } from "./utils/api";
import AuthModal from "./components/AuthModal";
import FoodWheel from "./components/FoodWheel";
import AdminPage from "./pages/AdminPage";

/**
 * 全局入口组件
 *
 * 启动时检测 LocalStorage 是否有 Token：
 *   - 有 → 已投胎用户，直接进入主页
 *   - 无 → 清白小白，强制弹出 AuthModal 完成身份初始化
 *
 * 一键投胎完成后，使用原生 alert() 下发后端沙雕欢迎语，
 * 确保在移动端 WebView 和 PWA 场景下都有明确反馈。
 */
export default function App() {
  const [user, setUser] = useState(null);           // { userId, nickname, userRole }
  const [showAuth, setShowAuth] = useState(false);  // 是否弹出认证弹窗
  const [initDone, setInitDone] = useState(false);  // 初始化是否完成
  const [currentView, setCurrentView] = useState("wheel"); // wheel | admin —— 视图状态机分水岭

  // ─── 启动：检测本地身份 ─────────────────
  useEffect(() => {
    const saved = getAuthUser();
    if (saved && saved.userId && saved.nickname) {
      // 有 Token 且 user 信息完整 → 已投胎，直接进入
      setUser(saved);
      setInitDone(true);
    } else {
      // 清白小白 / Token 过期 → 拉起认证弹窗
      setShowAuth(true);
      setInitDone(true);
    }
  }, []);

  // ─── 认证成功回调 ──────────────────────
  const handleAuthSuccess = useCallback((authData) => {
    const { userId, nickname, userRole, welcomeMessage } = authData;
    setUser({ userId, nickname, userRole });
    setShowAuth(false);

    // 用 alert 下发欢迎语（移动端友好，PWA 场景有明确反馈）
    if (welcomeMessage) {
      alert(welcomeMessage);
    }
  }, []);

  // ─── 退出登录 ─────────────────────────
  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
    setCurrentView("wheel");
    setShowAuth(true);
  }, []);

  // ─── 冷启动默认假数据（API 未就绪时的兜底转盘） ──
  const DEFAULT_DISHES = [
    { id: 1,  dishName: "黄焖鸡米饭",   stallName: "二楼黄焖鸡", price: 15, avgRating: 4.2 },
    { id: 2,  dishName: "麻辣香锅",     stallName: "一楼香锅王", price: 28, avgRating: 3.8 },
    { id: 3,  dishName: "石锅拌饭",     stallName: "韩式档口",   price: 18, avgRating: 4.5 },
    { id: 4,  dishName: "番茄鸡蛋面",   stallName: "面馆老张",   price: 10, avgRating: 3.2 },
    { id: 5,  dishName: "炸鸡汉堡套餐", stallName: "西餐窗口",   price: 22, avgRating: 2.1 },
    { id: 6,  dishName: "螺蛳粉",       stallName: "广西味道",   price: 14, avgRating: 1.8 },
    { id: 7,  dishName: "铁板牛肉饭",   stallName: "铁板烧档口", price: 25, avgRating: 3.9 },
    { id: 8,  dishName: "麻辣烫",       stallName: "自选麻辣烫", price: 20, avgRating: 3.5 },
    { id: 9,  dishName: "烤鱼饭",       stallName: "三楼烤鱼",   price: 32, avgRating: 4.0 },
    { id: 10, dishName: "鸡蛋灌饼",     stallName: "早餐铺",     price: 7,  avgRating: 4.7 },
  ];

  // ─── 初始化未完成 → 空白页（闪屏保护） ──
  if (!initDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <p className="text-4xl animate-bounce">🍜</p>
          <p className="text-amber-600 font-bold mt-3">食堂正在开火...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* ── 顶部导航栏 ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-gray-900">
            {currentView === "admin" ? "⚔️ 食堂审判庭" : "🍔 今天吃什么"}
          </h1>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* ADMIN 专属：转盘 / 审判庭 切页开关 —— 彻底消灭幽灵入口断层 */}
                {user.userRole === "ADMIN" && (
                  <button
                    onClick={() => setCurrentView(currentView === "wheel" ? "admin" : "wheel")}
                    className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-full
                               font-bold hover:bg-red-600 active:scale-95 transition-all"
                  >
                    {currentView === "wheel" ? "⚙️ 进入审判庭" : "🎡 回到大转盘"}
                  </button>
                )}
                <span className="text-xs text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
                  {user.nickname}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs bg-purple-500 text-white px-3 py-1.5 rounded-full
                           font-bold hover:bg-purple-600 active:scale-95 transition-all"
              >
                登录 / 投胎
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 主内容区 ── */}
      <main className="max-w-lg mx-auto py-6">
        {/* 未登录且弹窗关闭 → 引导投胎 */}
        {!user && !showAuth && (
          <div className="text-center py-20 px-4">
            <p className="text-6xl mb-4">👻</p>
            <p className="text-gray-500 mb-4">
              你现在是食堂的孤魂野鬼
              <br />
              投个胎，获得花名，才能开转盘
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500
                         text-white font-bold rounded-full shadow-lg
                         hover:from-purple-600 hover:to-pink-600 active:scale-95
                         transition-all"
            >
              🎲 一键投胎，立刻获得花名
            </button>
          </div>
        )}

        {/* 已登录 → 状态机分流 —— currentView 决定渲染转盘还是审判庭 */}
        {user && currentView === "wheel" && (
          <FoodWheel
            dishes={DEFAULT_DISHES}  // 冷启动默认数据；API 就绪后替换
            onSpinResult={(data) => console.log("抽中:", data)}
          />
        )}
        {user && currentView === "admin" && (
          <AdminPage />
        )}
      </main>

      {/* ── 全局认证弹窗 ── */}
      {showAuth && (
        <AuthModal
          onClose={() => {
            // 如果已登录用户可以关闭弹窗，未登录则不能跳过
            if (user) setShowAuth(false);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
```

### 6.5 AdminPage —— 后台审判看板

```jsx
// src/pages/AdminPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

/**
 * 管理员后台审判看板
 *
 * 双 Tab 布局：
 *  - "高危恶评" : 拉取被举报评论列表，支持一键斩杀（隐藏评论）+ 封印此魂（封号）
 *  - "菜品操控" : 管理转盘菜品池（研发中占位提示，后续迭代补全）
 */
export default function AdminPage() {
  const [tab, setTab] = useState("reports");   // reports | dishes
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // ─── 拉取被举报恶评列表 ─────────────────
  const fetchReported = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/admin/comment/reported");
      setComments(res.data || []);
    } catch (err) {
      setError(err.message || "获取恶评列表失败，管理员请检查网络");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tab 切换瞬间清空脏状态 —— 阻断上一页面报错/成功提示/旧数据跨 Tab 残留
    // 管理控制台必须保持绝对数据纯净，不能容忍异步延迟导致的界面污染
    setError("");
    setActionMsg("");
    setComments([]);
    if (tab === "reports") fetchReported();
  }, [tab, fetchReported]);

  // ─── 一键斩杀此评 ───────────────────────
  const handleHideComment = async (commentId) => {
    setActionMsg("");
    try {
      await api(`/admin/comment/${commentId}`, { method: "DELETE" });
      setActionMsg(`评论 #${commentId} 已斩杀，刷新列表中...`);
      setTimeout(() => fetchReported(), 500);
    } catch (err) {
      setError(err.message || "斩杀失败，请重试");
    }
  };

  // ─── 封印此魂 ───────────────────────────
  const handleBanUser = async (userId, nickname) => {
    if (!window.confirm(`确定要封禁用户「${nickname}」吗？封禁后该账号将无法登录和使用。`)) {
      return;
    }
    setActionMsg("");
    try {
      await api(`/admin/user/ban/${userId}`, { method: "POST" });
      setActionMsg(`用户「${nickname}」已被永久封印。`);
    } catch (err) {
      setError(err.message || "封禁失败，请重试");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── 顶部标题栏 ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-gray-900">
            ⚔️ 食堂审判庭
          </h1>
          <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-bold">
            ADMIN
          </span>
        </div>
      </header>

      {/* ── Tab 切换 ── */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setTab("reports")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all
              ${tab === "reports"
                ? "bg-red-500 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"}`}
          >
            🚨 高危恶评
          </button>
          <button
            onClick={() => setTab("dishes")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all
              ${tab === "dishes"
                ? "bg-purple-500 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"}`}
          >
            🎡 菜品操控
          </button>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* ── 操作反馈提示 ── */}
        {actionMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700
                          text-sm text-center py-2.5 rounded-xl animate-[slideUp_0.3s_ease-out]">
            {actionMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-500
                          text-sm text-center py-2.5 rounded-xl">{error}</div>
        )}

        {/* ── 高危恶评 Tab ── */}
        {tab === "reports" && (
          <div className="space-y-3">
            {loading && (
              <div className="text-center py-10">
                <p className="text-3xl animate-bounce">🔍</p>
                <p className="text-gray-400 text-sm mt-2">正在扫描全站恶评...</p>
              </div>
            )}

            {!loading && comments.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-4xl mb-2">🕊️</p>
                <p className="text-gray-400">暂未被举报的评论，世界和平。</p>
              </div>
            )}

            {!loading && comments.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4
                           hover:shadow-md transition-shadow"
              >
                {/* 评论内容 */}
                <p className="text-gray-800 text-sm leading-relaxed mb-3">
                  {c.content || "（无文本内容）"}
                </p>

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3">
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    {"★".repeat(c.rating || 0)}{"☆".repeat(5 - (c.rating || 0))}
                  </span>
                  <span>用户 ID: {c.userId}</span>
                  <span>菜品 ID: {c.dishId}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    🚩 被举报 {c.reportCount} 次
                  </span>
                </div>

                {/* 操作按钮组 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleHideComment(c.id)}
                    className="flex-1 py-2 bg-red-500 text-white text-sm font-bold rounded-xl
                               hover:bg-red-600 active:scale-95 transition-all"
                  >
                    ⚔️ 斩杀此评
                  </button>
                  <button
                    onClick={() => handleBanUser(c.userId, `用户${c.userId}`)}
                    className="flex-1 py-2 bg-gray-800 text-white text-sm font-bold rounded-xl
                               hover:bg-black active:scale-95 transition-all"
                  >
                    🔒 封印此魂
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 菜品操控 Tab（研发中占位） ── */}
        {tab === "dishes" && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">👨‍💻</p>
            <p className="text-gray-500 font-bold text-lg">菜品增删改查模块</p>
            <p className="text-gray-400 text-sm mt-1">
              后端 API 已就绪（POST/PUT/DELETE /api/admin/dish）
            </p>
            <p className="text-gray-400 text-sm">
              管理界面正在紧急开发中，请先通过 API 工具操作
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
```

### 6.6 Tailwind CSS 补充动画配置

在 `tailwind.config.js` 中添加：

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          "0%":   { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
```

---

## 7. 运维与 Docker 部署 (Deployment)

### 7.1 后端 Dockerfile

```dockerfile
# ─── Stage 1: 构建 ─────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# 先复制 pom.xml 利用 Docker 缓存层
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 复制源码并打包
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2: 运行 ─────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 达梦 JDBC 驱动（需从达梦官网下载放入 lib 目录）
COPY lib/DmJdbcDriver18.jar /app/lib/DmJdbcDriver18.jar

# 复制构建产物
COPY --from=builder /app/target/*.jar app.jar

# 健康检查（Spring Boot Actuator）
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Shanghai", "app.jar"]
```

### 7.2 Nginx 配置

```nginx
# nginx.conf
upstream backend {
    server spring-boot:8080 weight=1 max_fails=3 fail_timeout=30s;
}

# ─── 限流区域定义 ──────────────────────────
# 每个 IP 每秒最多 10 次请求（API）
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
# 每个 IP 每分钟最多 3 次转盘请求（防恶意刷转盘）
limit_req_zone $binary_remote_addr zone=wheel_limit:10m rate=3r/m;
# 每个 IP 每分钟最多 5 次投胎请求（防花名占坑攻击）
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

server {
    listen 80;
    server_name _;

    # 前端静态资源
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1024;

    # ─── 静态资源缓存 ──────────────────────
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # ─── API 反向代理 ──────────────────────
    location /api/ {
        # 通用 API 限流（burst=30 大缓冲桶 + nodelay 快速响应，消灭早八流量脉冲 503 误杀）
        limit_req zone=api_limit burst=30 nodelay;

        # 转盘接口额外限流
        location /api/wheel/spin {
            limit_req zone=wheel_limit burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # 一键投胎接口额外限流（防恶意批量注册占坑花名）
        location /api/auth/quick-register {
            limit_req zone=auth_limit burst=3 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 10s;
        proxy_read_timeout 30s;
    }

    # ─── SPA 路由回退 ──────────────────────
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ─── 安全头 ────────────────────────────
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 7.3 Docker Compose 一键部署

```yaml
# docker-compose.yml
version: "3.9"

services:
  # ─── 达梦数据库 DM8 ──────────────────────
  dm8:
    image: registry.cn-hangzhou.aliyuncs.com/dm8/dm8:latest
    container_name: campus-dm8
    environment:
      CASE_SENSITIVE: "N"           # 大小写不敏感
      UNICODE_FLAG: 1               # UTF-8 编码
      LENGTH_IN_CHAR: 1             # VARCHAR 按字符计数
      COMPATIBLE_MODE: 4            # 兼容 MySQL 模式
      PAGE_SIZE: 16                 # 页大小 16K
      DB_NAME: CAMPUS_EAT
      SYSDBA_PWD: "Ajiahao987*"      # SYSDBA 密码（* 必须双引号锁定，防 YAML 解析/Shell Globbing 爆雷）
    ports:
      - "5236:5236"
    volumes:
      - dm8_data:/opt/dmdbms/data
      - ./sql/init:/docker-entrypoint-initdb.d  # 初始化 SQL 脚本
    networks:
      - campus-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "/opt/dmdbms/bin/disql", "SYSDBA/\"Ajiahao987*\"@localhost:5236", "-e", "SELECT 1"]
      interval: 15s
      timeout: 10s
      retries: 5
      start_period: 30s

  # ─── Spring Boot 后端 ────────────────────
  spring-boot:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: campus-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:dm://dm8:5236/CAMPUS_EAT?useUnicode=true&characterEncoding=UTF-8&compatibleMode=mysql
      SPRING_DATASOURCE_USERNAME: SYSDBA
      SPRING_DATASOURCE_PASSWORD: "Ajiahao987*"
      SPRING_PROFILES_ACTIVE: prod
    ports:
      - "8080:8080"
    depends_on:
      dm8:
        condition: service_healthy
    networks:
      - campus-net
    restart: unless-stopped

  # ─── Nginx 前端 + 反向代理 ────────────────
  nginx:
    image: nginx:1.25-alpine
    container_name: campus-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html:ro
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro           # SSL 证书（可选）
    depends_on:
      - spring-boot
    networks:
      - campus-net
    restart: unless-stopped

volumes:
  dm8_data:
    driver: local

networks:
  campus-net:
    driver: bridge
```

### 7.4 Spring Boot 达梦数据库配置

```yaml
# application-prod.yml
spring:
  datasource:
    url: jdbc:dm://dm8:5236/CAMPUS_EAT?useUnicode=true&characterEncoding=UTF-8&compatibleMode=mysql
    username: SYSDBA
    password: "Ajiahao987*"
    driver-class-name: dm.jdbc.driver.DmDriver
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 10000
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-test-query: SELECT 1   # 达梦连接活性自检心跳，规避连接池假死

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto              # 全局默认 AUTO；实体类用 @TableId(type=IdType.AUTO) 覆盖
      table-prefix: T_           # 自动匹配 T_ 前缀表
      # ⚠️ 达梦 IDENTITY 列：实体类主键必须加 @TableId(type = IdType.AUTO)
      #     否则 MP 生成 id=null 插入时达梦报错："不能向自增列插入值"
  mapper-locations: classpath*:/mapper/**/*.xml
```

### 7.5 Entity 实体类示例（达梦适配关键）

```java
package com.campus.eatpicker.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("T_CAMPUS_DISH")       // ← DM8 大小写敏感：表名全大写
public class CampusDish {

    @TableId(type = IdType.AUTO)  // ← 关键：达梦 IDENTITY 必须用 AUTO，不让 MP 生成 id 值
    private Long id;

    @TableField("DISH_NAME")      // ← 显式映射大写列名，规避 DM8 默认大小写敏感
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

    @TableField("DISH_STATUS")    // ← 不是 "STATUS"，规避 DM8 保留字
    private String dishStatus;

    @TableField("SUBMIT_USER_ID")
    private Long submitUserId;

    @TableField("CREATE_TIME")
    private Date createTime;

    @TableField("UPDATE_TIME")
    private Date updateTime;
}
```

### 7.6 启动命令
# 1. 先构建前端
cd frontend && npm install && npm run build

# 2. 初始化 SQL 放到 sql/init/ 目录
mkdir -p sql/init
cp docs/schema.sql sql/init/01-schema.sql

# 3. 确认目录结构
# .
# ├── docker-compose.yml
# ├── nginx/nginx.conf
# ├── frontend/dist/
# ├── backend/Dockerfile
# └── sql/init/01-schema.sql

# 4. 一键启动
docker-compose up -d

# 5. 查看日志
docker-compose logs -f spring-boot

# 6. 验证
curl http://localhost/api/wheel/spin -X POST -H 'Content-Type: application/json' -d '{}'
```

---

## 附录：项目目录结构（终审封板生产级白皮书）

```
what-to-eat-wheel/
├── docker-compose.yml
├── nginx/
│   ├── nginx.conf
│   └── ssl/
├── sql/
│   └── init/
│       └── 01-schema.sql                 # DDL（含 T_NICKNAME_POOL 预置数据）
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx             # 🆕 一键投胎 + 登录弹窗
│   │   │   ├── FoodWheel.jsx             # 大转盘组件（fetch-first-then-animate）
│   │   │   └── RoastCard.jsx             # 毒舌卡片组件
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RankingPage.jsx           # 红黑榜
│   │   │   └── AdminPage.jsx             # 🆕 后台审判看板
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   └── api.js                    # 🆕 JWT 拦截 + fetch 封装
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── Dockerfile
│   ├── lib/
│   │   └── DmJdbcDriver18.jar
│   ├── pom.xml
│   └── src/main/java/com/campus/eatpicker/
│       ├── EatPickerApplication.java
│       ├── common/
│       │   └── Result.java               # 🆕 统一响应体
│       ├── config/
│       │   ├── JwtInterceptor.java       # 🆕 JWT 拦截器
│       │   ├── AdminInterceptor.java     # 🆕 管理员 RBAC 拦截器
│       │   ├── WebConfig.java            # 🆕 双层拦截器注册
│       │   └── GlobalExceptionHandler.java # 🆕 全局异常处理
│       ├── util/
│       │   └── JwtUtil.java              # 🆕 JWT 工具类
│       ├── controller/
│       │   ├── AuthController.java       # 🆕 一键投胎 + 登录
│       │   ├── AdminController.java      # 🆕 安全管理后台
│       │   └── WheelController.java
│       ├── service/
│       │   ├── UserService.java          # 🆕 用户服务接口
│       │   ├── WheelService.java
│       │   └── impl/
│       │       ├── UserServiceImpl.java  # 🆕 一键投胎核心逻辑
│       │       └── WheelServiceImpl.java
│       ├── mapper/
│       │   ├── AppUserMapper.java        # 🆕
│       │   ├── CampusDishMapper.java
│       │   ├── DishCommentMapper.java
│       │   └── NicknamePoolMapper.java   # 🆕
│       ├── entity/
│       │   ├── AppUser.java              # 🆕（全 @TableField 大写映射）
│       │   ├── CampusDish.java
│       │   ├── DishComment.java
│       │   └── NicknamePool.java         # 🆕
│       └── dto/
│           ├── AuthResultDTO.java        # 🆕
│           ├── LoginRequestDTO.java      # 🆕
│           ├── WheelResultDTO.java
│           └── SpinRequestDTO.java
└── README.md
```

---

> **因为信任所以简单。** 转盘交给概率，点评交给群众，代码交给你。这个项目的底层逻辑已经拉通了——剩下的就是把执行颗粒度做细，真正闭环掉"今天吃什么"这个世纪难题。
>
> 让每个大学生饭点打开这个 App 的时候，能收获的不只是一顿饭的建议，还有一句精准暴击的毒舌段子，和一份"原来不只我一个人被这菜坑过"的归属感。
>
> **开干吧，别让隔壁组再把 MVP 先卷出来。** 🚀

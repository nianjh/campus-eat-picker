-- =============================================
-- 校园"今天吃什么" —— 演示菜品初始数据
-- 10 道典型校园档口菜品，含高分/低分/刺客/平庸
-- 确保项目启动时大转盘即有火药味，不触发纯灰底降级
-- =============================================

INSERT INTO T_CAMPUS_DISH (DISH_NAME, STALL_NAME, CANTEEN_NAME, FLOOR_NUM, PRICE, AVG_RATING, REVIEW_COUNT, WEIGHT_FACTOR, DISH_STATUS, CREATE_TIME, UPDATE_TIME)
VALUES
-- 🔥 白月光神菜（高分爆款）
('黄焖鸡米饭',   '二楼黄焖鸡',   '第一食堂', 2, 15.00, 4.50, 128, 1.50, 'ACTIVE', SYSDATE, SYSDATE),
('鸡蛋灌饼',     '早餐铺',       '第一食堂', 1,  7.00, 4.70, 95,  1.50, 'ACTIVE', SYSDATE, SYSDATE),
('石锅拌饭',     '韩式档口',     '第二食堂', 1, 18.00, 4.30, 76,  1.30, 'ACTIVE', SYSDATE, SYSDATE),

-- 💀 黑暗料理（低分避雷）
('螺蛳粉',       '广西味道',     '第一食堂', 1, 14.00, 1.80, 52,  3.00, 'ACTIVE', SYSDATE, SYSDATE),
('炸鸡汉堡套餐', '西餐窗口',     '第二食堂', 2, 22.00, 2.10, 41,  3.00, 'ACTIVE', SYSDATE, SYSDATE),
('番茄鸡蛋面',   '面馆老张',     '第一食堂', 1, 10.00, 2.40, 33,  2.50, 'ACTIVE', SYSDATE, SYSDATE),

-- 🗡️ 食堂刺客（高价低性价比）
('烤鱼饭',       '三楼烤鱼',     '第二食堂', 3, 32.00, 3.20, 28,  0.50, 'ACTIVE', SYSDATE, SYSDATE),
('铁板牛肉饭',   '铁板烧档口',   '第一食堂', 1, 25.00, 3.00, 22,  0.60, 'ACTIVE', SYSDATE, SYSDATE),

-- 😐 平庸菜（中规中矩）
('麻辣烫',       '自选麻辣烫',   '第二食堂', 1, 20.00, 3.50, 60,  1.00, 'ACTIVE', SYSDATE, SYSDATE),
('麻辣香锅',     '一楼香锅王',   '第一食堂', 1, 28.00, 3.80, 45,  1.00, 'ACTIVE', SYSDATE, SYSDATE);

COMMIT;

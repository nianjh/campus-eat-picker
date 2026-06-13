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
 *
 * 特性：
 * - 自动从 LocalStorage 提取 Token 并挂载 Authorization 头
 * - 401 Token 过期熔断守卫：非白名单接口触发清空脏数据 + 页面重载
 * - 白名单豁免：一键投胎/登录接口自身的 401 属于业务拒绝，绝不禁发 reload() 导致死循环刷屏
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
      path.includes("/auth/register") ||
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

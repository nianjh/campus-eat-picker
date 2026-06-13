// src/components/AuthModal.jsx — Neo-Brutalist Modal
import React, { useState } from "react";
import { api, saveAuth, getAuthUser, clearAuth } from "../utils/api";

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("reincarnation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register fields
  const [regId, setRegId] = useState("");
  const [regNick, setRegNick] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");

  const handleQuick = async () => {
    setLoading(true); setError("");
    try { const r = await api("/auth/quick-register", { method: "POST" }); const { token, userId, nickname, userRole, welcomeMessage } = r.data; saveAuth(token, { userId, nickname, userRole }); onAuthSuccess?.({ userId, nickname, userRole, welcomeMessage }); onClose?.(); }
    catch (err) { setError(err.message || "REINCARNATION FAILED — 再试一次？"); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regId.trim()) { setError("学号总得填一下吧？10位数字，如 2023212099"); return; }
    if (regPw.length < 6) { setError("密码至少6位"); return; }
    if (regPw !== regPw2) { setError("两次密码不一致"); return; }
    setLoading(true); setError("");
    try {
      const body = { studentId: regId.trim(), password: regPw };
      if (regNick.trim()) body.nickname = regNick.trim();
      const r = await api("/auth/register", { method: "POST", body: JSON.stringify(body) });
      const { token, userId, nickname, userRole, welcomeMessage } = r.data;
      saveAuth(token, { userId, nickname, userRole });
      onAuthSuccess?.({ userId, nickname, userRole, welcomeMessage }); onClose?.();
    }
    catch (err) { setError(err.message || "REGISTER FAILED"); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPw.trim()) { setError("学号和密码总得填一下吧？"); return; }
    setLoading(true); setError("");
    try { const r = await api("/auth/login", { method: "POST", body: JSON.stringify({ studentId: loginId.trim(), password: loginPw }) }); const { token, userId, nickname, userRole, welcomeMessage } = r.data; saveAuth(token, { userId, nickname, userRole }); onAuthSuccess?.({ userId, nickname, userRole, welcomeMessage }); onClose?.(); }
    catch (err) { setError(err.message || "LOGIN FAILED"); }
    finally { setLoading(false); }
  };

  const currentUser = getAuthUser();

  const switchMode = (m) => { setMode(m); setError(""); };

  return (
    <div className="brutal-overlay">
      <div className="brutal-modal animate-pop-in">
        {/* Top accent strip */}
        <div className="h-[6px] bg-brutal-fg" />
        <div className="p-6">
          <h2 className="text-title text-brutal-fg text-center mb-1">
            {currentUser ? "你已投胎成功" : "欢迎来到食堂吃瓜一线"}
          </h2>
          <p className="text-label text-brutal-muted text-center mb-6">
            {currentUser ? `当前身份：${currentUser.nickname}` : "选一种方式进入，然后开始转盘和点评"}
          </p>

          {currentUser ? (
            <div className="space-y-4">
              <div className="border-3 border-brutal-fg bg-brutal-bg p-6 text-center">
                <p className="text-5xl mb-3">🍜</p>
                <p className="text-title text-brutal-fg">{currentUser.nickname}</p>
                <p className="text-label text-brutal-muted mt-1 uppercase">你的花名已刻入食堂族谱</p>
              </div>
              <button onClick={() => { clearAuth(); onClose?.(); }} className="w-full py-3 brutal-btn-ghost text-label">退出登录，重新投胎</button>
            </div>
          ) : (<>
            {/* Mode tabs — brutal pill group */}
            <div className="flex border-3 border-brutal-fg mb-6">
              <button onClick={() => switchMode("reincarnation")}
                className={`flex-1 py-3 text-label uppercase transition-colors ${mode === "reincarnation" ? "bg-brutal-fg text-white" : "bg-white text-brutal-fg hover:bg-brutal-bg"}`}>🎲 投胎</button>
              <button onClick={() => switchMode("register")}
                className={`flex-1 py-3 text-label uppercase transition-colors ${mode === "register" ? "bg-brutal-blue text-white" : "bg-white text-brutal-fg hover:bg-brutal-bg"}`}>📝 注册</button>
              <button onClick={() => switchMode("login")}
                className={`flex-1 py-3 text-label uppercase transition-colors ${mode === "login" ? "bg-brutal-fg text-white" : "bg-white text-brutal-fg hover:bg-brutal-bg"}`}>📖 登录</button>
            </div>

            {mode === "reincarnation" && (
              <div className="space-y-5">
                <div className="border-3 border-brutal-fg bg-brutal-bg p-6 text-center space-y-3">
                  <p className="text-6xl">🎰</p>
                  <p className="text-body text-brutal-fg/70 leading-relaxed">
                    系统会随机给你分配一个<strong className="text-brutal-fg">沙雕花名</strong><br/>
                    无需手机号、无需邮箱、无需学号<br/>
                    <span className="text-brutal-primary font-extrabold uppercase">真正的「一键投胎」</span>
                  </p>
                  <p className="text-label text-brutal-muted/50 uppercase">花名一旦生成不可修改（30 天内）</p>
                </div>
                {error && <div className="brutal-badge-danger text-center w-full py-2">{error}</div>}
                <button onClick={handleQuick} disabled={loading}
                  className="w-full py-4 brutal-btn-primary text-lg uppercase">
                  {loading ? (<span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-3 border-white border-t-transparent animate-spin" style={{borderRadius:'50%'}}/>投胎中...</span>) : "🎲 随机分配花名，开吃！"}
                </button>
              </div>
            )}

            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">学号</label>
                  <input type="text" value={regId} onChange={e => setRegId(e.target.value)}
                    placeholder="2023212099"
                    maxLength={10}
                    className="brutal-input" />
                  <p className="text-mono-sm text-brutal-muted mt-1">10位数字学号，注册后可用于登录</p>
                </div>
                <div>
                  <label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">花名（可选）</label>
                  <input type="text" value={regNick} onChange={e => setRegNick(e.target.value)}
                    placeholder="不填则随机生成沙雕花名"
                    className="brutal-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">密码</label>
                    <input type="password" value={regPw} onChange={e => setRegPw(e.target.value)}
                      placeholder="至少6位"
                      className="brutal-input" />
                  </div>
                  <div>
                    <label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">确认密码</label>
                    <input type="password" value={regPw2} onChange={e => setRegPw2(e.target.value)}
                      placeholder="再输一遍"
                      className="brutal-input" />
                  </div>
                </div>
                {error && <div className="brutal-badge-danger text-center w-full py-2">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 brutal-btn-primary text-lg uppercase">
                  {loading ? "注册中..." : "📝 注册并进入"}
                </button>
                <p className="text-label text-brutal-muted text-center uppercase">已有账号？切到「登录」直接进入</p>
              </form>
            )}

            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div><label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">学号</label><input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="2023212099" className="brutal-input" /></div>
                <div><label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">密码</label><input type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} placeholder="········" className="brutal-input" /></div>
                {error && <div className="brutal-badge-danger text-center w-full py-2">{error}</div>}
                <button type="submit" disabled={loading} className="w-full py-4 brutal-btn-secondary text-lg uppercase">{loading ? "登录中..." : "📖 老怨种回归"}</button>
                <p className="text-label text-brutal-muted text-center uppercase">还没账号？切到「注册」创建正经身份</p>
              </form>
            )}
          </>)}
        </div>
        {!currentUser && (
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-3 border-brutal-fg bg-white text-brutal-fg font-bold hover:bg-brutal-fg hover:text-white transition-colors">✕</button>
        )}
      </div>
    </div>
  );
}

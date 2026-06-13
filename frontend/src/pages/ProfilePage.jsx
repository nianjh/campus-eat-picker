// src/pages/ProfilePage.jsx — Neo-Brutalist Profile
import React, { useState, useEffect, useCallback } from "react";
import { api, saveAuth, getAuthUser } from "../utils/api";

export default function ProfilePage({ onBack }) {
  const user = getAuthUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Edit state
  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState("");
  const [bindId, setBindId] = useState("");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError("");
    try { const r = await api("/user/profile"); setProfile(r.data); setNick(r.data.nickname || ""); }
    catch (e) { setError(e.message || "FETCH_FAILED"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");

    // If changing password, validate
    const changingPw = newPw || curPw;
    if (changingPw) {
      if (!curPw) { setError("请输入当前密码"); return; }
      if (!newPw || newPw.length < 6) { setError("新密码至少6位"); return; }
      if (newPw !== newPw2) { setError("两次新密码不一致"); return; }
    }

    setSaving(true);
    try {
      const body = {};
      if (bindId.trim()) body.studentId = bindId.trim();
      if (nick.trim() !== (profile?.nickname || "")) body.nickname = nick.trim();
      if (changingPw) { body.currentPassword = curPw; body.newPassword = newPw; }

      if (!body.studentId && !body.nickname && !body.newPassword) { setMsg("没什么可改的"); setSaving(false); setEditing(false); return; }

      const r = await api("/user/profile", { method: "PUT", body: JSON.stringify(body) });
      const updated = r.data;

      // Update localStorage if nickname changed
      if (updated.nickname !== user?.nickname) {
        saveAuth(localStorage.getItem("eat_token") || "", {
          userId: updated.userId,
          nickname: updated.nickname,
          userRole: updated.userRole,
        });
      }

      setProfile(updated);
      setMsg("个人资料已更新！");
      setEditing(false);
      setCurPw(""); setNewPw(""); setNewPw2("");
    }
    catch (e) { setError(e.message || "UPDATE_FAILED"); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => {
    setEditing(false);
    setNick(profile?.nickname || "");
    setBindId(""); setCurPw(""); setNewPw(""); setNewPw2("");
    setError(""); setMsg("");
  };

  if (loading) return (
    <div className="text-center py-16 sm:py-24">
      <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">📂</p>
      <p className="text-[10px] sm:text-xs text-brutal-muted uppercase">正在调取食生档案...</p>
    </div>
  );

  if (error && !profile) return (
    <div className="text-center py-16 sm:py-24">
      <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">😵</p>
      <p className="text-sm sm:text-base text-brutal-danger">{error}</p>
      <button onClick={onBack} className="mt-4 sm:mt-6 brutal-btn-ghost text-[10px] sm:text-xs px-6 sm:px-8 py-2 sm:py-2.5 uppercase min-h-[44px]">← 回到大转盘</button>
    </div>
  );

  const isQuickUser = !profile?.studentId;

  return (
    <div className="min-h-screen -mx-3 sm:-mx-6 -mt-6 sm:-mt-10 bg-brutal-bg">
      {/* Hero */}
      <div className="bg-brutal-fg px-4 sm:px-6 py-8 sm:py-10 border-b-4 border-brutal-fg">
        <button onClick={onBack} className="text-white/60 text-[10px] sm:text-xs uppercase mb-4 sm:mb-5 flex items-center gap-1 hover:text-white font-extrabold transition-colors">← 回到大转盘</button>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="w-14 h-14 sm:w-20 sm:h-20 border-3 sm:border-4 border-white bg-brutal-primary flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-3xl font-extrabold text-white">{(profile?.nickname || "?").charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight truncate">{profile?.nickname}</h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
              <span className="brutal-badge-yellow text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5">{profile?.userRole === "ADMIN" ? "ADMIN" : "STUDENT"}</span>
              {profile?.studentId
                ? <span className="text-[10px] sm:text-xs text-white/50 font-mono truncate">学号 {profile.studentId}</span>
                : <span className="text-[10px] sm:text-xs text-white/50 font-mono truncate">一键投胎用户 · 无学号绑定</span>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 -mt-4 space-y-4 sm:space-y-6 pb-8 sm:pb-10">
        {/* Info Card */}
        <div className="brutal-card p-3 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em] mb-3 sm:mb-4">📋 食生档案</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              ["花名", profile?.nickname, false],
              ["学号", profile?.studentId || "— (未绑定)", true],
              ["角色", profile?.userRole || "STUDENT", false],
              ["状态", profile?.accountStatus || "ACTIVE", false],
              ["注册时间", (profile?.createTime || "").slice(0,10) || "—", true],
              ["最近登录", (profile?.lastLoginTime || "").slice(0,10) || "—", true],
            ].map(([label, value, mono]) => (
              <div key={label} className="flex justify-between border-b-3 border-brutal-fg/10 pb-1.5 sm:pb-2">
                <span className="text-[10px] sm:text-xs text-brutal-muted uppercase font-mono">{label}</span>
                <span className={`text-sm sm:text-base font-bold text-brutal-fg ${mono ? 'font-mono text-xs sm:text-sm' : ''}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Card */}
        <div className="brutal-card p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em]">⚙️ 个人设置</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="brutal-btn-primary px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs min-h-[40px]">
                编辑资料
              </button>
            )}
          </div>

          {msg && !error && (
            <div className="mb-3 sm:mb-4 border-3 border-brutal-green bg-brutal-green/10 text-brutal-green text-[10px] sm:text-xs text-center py-2 sm:py-3 px-3 sm:px-4 uppercase font-extrabold">{msg}</div>
          )}
          {error && (
            <div className="mb-3 sm:mb-4 border-3 border-brutal-danger bg-brutal-danger/10 text-brutal-danger text-[10px] sm:text-xs text-center py-2 sm:py-3 px-3 sm:px-4 uppercase font-extrabold">{error}</div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
              {isQuickUser && (
                <div className="border-3 border-brutal-secondary bg-brutal-secondary/5 p-3 sm:p-4">
                  <label className="block text-[10px] sm:text-xs text-brutal-fg uppercase mb-1 sm:mb-1.5 font-mono">🔗 绑定学号</label>
                  <input type="text" value={bindId} onChange={e => setBindId(e.target.value)} maxLength={10} placeholder="2023212099" className="brutal-input text-sm py-2.5" />
                  <p className="text-[10px] sm:text-xs text-brutal-muted mt-1 sm:mt-1.5">一键投胎用户无学号。绑定后可用学号登录，<strong className="text-brutal-fg">仅一次机会</strong>。</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 sm:mb-1.5 font-mono">花名</label>
                <input type="text" value={nick} onChange={e => setNick(e.target.value)} maxLength={20} className="brutal-input text-sm py-2.5" />
              </div>

              <div className="border-t-3 border-brutal-fg/10 pt-3 sm:pt-4">
                <p className="text-[10px] sm:text-xs text-brutal-muted uppercase mb-2 sm:mb-3 font-mono">修改密码（不填则不修改）</p>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 font-mono">当前密码</label>
                    <input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} placeholder={isQuickUser ? "一键投胎默认密码: EatOrNot666" : "输入当前密码"} className="brutal-input text-sm py-2.5" />
                    {isQuickUser && <p className="text-[10px] sm:text-xs text-brutal-muted mt-1">默认密码：EatOrNot666</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 font-mono">新密码</label>
                      <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="至少6位" className="brutal-input text-sm py-2.5" />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 font-mono">确认新密码</label>
                      <input type="password" value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="再输一遍" className="brutal-input text-sm py-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                <button type="button" onClick={cancelEdit} className="flex-1 py-2.5 sm:py-3 brutal-btn-ghost text-[10px] sm:text-xs uppercase min-h-[44px]">取消</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 sm:py-3 brutal-btn-primary text-[10px] sm:text-xs uppercase min-h-[44px]">{saving ? "保存中..." : "保存"}</button>
              </div>
            </form>
          ) : (
            <div className="border-3 border-brutal-fg bg-brutal-bg p-4 sm:p-6 text-center">
              <p className="text-4xl sm:text-5xl mb-2 sm:mb-3">🍜</p>
              <p className="text-sm sm:text-base text-brutal-fg/70 leading-relaxed">
                这里可以<strong className="text-brutal-fg">{isQuickUser ? "绑定学号" : "修改"}</strong>、<strong className="text-brutal-fg">改花名</strong>和<strong className="text-brutal-fg">改密码</strong><br/>
                <span className="text-[10px] sm:text-xs text-brutal-muted/50 uppercase">点击右上角「编辑资料」开始修改</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

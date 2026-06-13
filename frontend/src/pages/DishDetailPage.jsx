// src/pages/DishDetailPage.jsx — Neo-Brutalist Detail (Responsive)
import React, { useState, useCallback } from "react";
import { api } from "../utils/api";

export default function DishDetailPage({ dish, user, onBack }) {
  const dishId = dish.dishId || dish.id;
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try { const r = await api(`/dish/${dishId}/comments`); setComments(r.data || []); } catch {} finally { setLoaded(true); }
  }, [dishId]);
  React.useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault(); if (!content.trim()) { setMsg("好歹写点什么吧！"); return; }
    setSubmitting(true); setMsg("");
    try { await api("/dish/comment", { method: "POST", body: JSON.stringify({ dishId, userId: user.userId, rating, content: content.trim(), isAnonymous: 0 }) }); setContent(""); setMsg("毒舌已发射！"); load(); }
    catch (err) { setMsg(err.message || "COMMENT_FAILED"); }
    finally { setSubmitting(false); }
  };

  const avg = dish.avgRating || 3;
  const tier = avg >= 4 ? "good" : avg < 2.5 ? "bad" : "mid";
  const hero = { good: "bg-brutal-green", bad: "bg-brutal-primary", mid: "bg-brutal-orange" }[tier];
  const tColor = { good: "text-brutal-green", bad: "text-brutal-primary", mid: "text-brutal-orange" }[tier];
  const emoji = { good: "😍", bad: "💀", mid: "😐" }[tier];

  return (
    <div className="min-h-screen -mx-3 sm:-mx-6 -mt-6 sm:-mt-10 bg-brutal-bg">
      {/* Hero */}
      <div className={`${hero} px-4 sm:px-6 py-8 sm:py-10 border-b-4 border-brutal-fg`}>
        <button onClick={onBack} className="text-brutal-fg/70 text-[10px] sm:text-xs uppercase mb-4 sm:mb-5 flex items-center gap-1 hover:text-brutal-fg font-extrabold transition-colors">← 回到大转盘</button>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-brutal-fg leading-tight">{emoji} {dish.dishName}</h1>
        <p className="text-sm sm:text-base text-brutal-fg/70 mt-1">{dish.stallName&&`${dish.stallName} · `}{dish.canteenName&&`${dish.canteenName} · `}¥{dish.price}</p>
        <div className="flex items-center gap-1 mt-3">
          <span className="text-xl sm:text-2xl font-extrabold text-brutal-fg">{Number(avg).toFixed(1)}</span>
          <span className="text-lg sm:text-xl">{"★".repeat(Math.round(avg))}{"☆".repeat(5-Math.round(avg))}</span>
        </div>
      </div>

      <div className="px-3 sm:px-4 -mt-4 space-y-4 sm:space-y-6 pb-8 sm:pb-10">
        {/* Roast */}
        {dish.roastText && (
          <div className="brutal-card p-3 sm:p-5">
            <p className="text-[10px] sm:text-xs text-brutal-muted uppercase mb-2 font-mono tracking-[0.1em]">[ SYSTEM_ROAST ]</p>
            <p className="text-sm sm:text-base text-brutal-fg/70 italic leading-relaxed">{dish.roastText}</p>
          </div>
        )}

        {/* Write Comment */}
        <div className="brutal-card p-3 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em] mb-3 sm:mb-4">✍️ 留下你的毒舌</h3>
          <form onSubmit={submit}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
              <span className="text-[9px] sm:text-[10px] text-brutal-muted uppercase font-mono mr-1">RATING</span>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  className={`text-lg sm:text-xl transition-all duration-150 ${s<=rating?tColor+" scale-110":"text-brutal-muted/20"} hover:scale-110 min-w-[28px] min-h-[28px]`}>★</button>
              ))}
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="这道菜给你留下了什么心理阴影..."
              className="brutal-input h-24 resize-none text-sm py-2.5" />
            {msg && <p className={`text-[10px] sm:text-xs mt-2 font-extrabold ${msg.includes("失败")?"text-brutal-danger":"text-brutal-green"}`}>{msg}</p>}
            <button type="submit" disabled={submitting} className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 brutal-btn-secondary text-[10px] sm:text-xs uppercase tracking-[0.06em] min-h-[44px]">
              {submitting ? "发射中..." : "💣 发射毒舌"}
            </button>
          </form>
        </div>

        {/* Comments */}
        <div className="brutal-card p-3 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em] mb-3 sm:mb-4">💬 食客点评 ({comments.length})</h3>
          {!loaded ? <p className="text-sm sm:text-base text-brutal-muted text-center py-6 sm:py-8">加载中...</p>
           : comments.length===0 ? <p className="text-sm sm:text-base text-brutal-muted text-center py-6 sm:py-8">还没有评论，来做第一个毒舌的人！</p>
           : <div className="space-y-3 sm:space-y-4">{comments.map((c,i)=>(
              <div key={c.id||i} className="border-b-3 border-brutal-fg pb-3 sm:pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5">
                  <span className="text-brutal-secondary text-xs sm:text-sm">{"★".repeat(c.rating||0)}</span>
                  <span className="text-[10px] sm:text-xs text-brutal-muted font-mono">{c.createTime||"刚刚"}</span>
                </div>
                <p className="text-sm sm:text-base text-brutal-fg/70 leading-relaxed">{c.content}</p>
              </div>
            ))}</div>}
        </div>
      </div>
    </div>
  );
}

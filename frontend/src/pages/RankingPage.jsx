// src/pages/RankingPage.jsx — Neo-Brutalist Rankings (Responsive)
import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export default function RankingPage() {
  const [red, setRed] = useState([]);
  const [black, setBlack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true); setError("");
    try { const [a,b] = await Promise.all([api("/dish/ranking/red"), api("/dish/ranking/black")]); setRed(a.data||[]); setBlack(b.data||[]); }
    catch(e) { setError(e.message||"DATA_FETCH_FAILED"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="text-center py-16 sm:py-20"><p className="text-4xl sm:text-5xl">📊</p><p className="text-[10px] sm:text-xs text-brutal-muted mt-3 sm:mt-4 uppercase">正在采集全校食评数据...</p></div>;
  if (error) return <div className="text-center py-16 sm:py-20"><p className="text-4xl sm:text-5xl mb-2 sm:mb-3">😵</p><p className="text-sm sm:text-base text-brutal-danger">{error}</p></div>;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* RED LIST */}
      <section className="brutal-card-strip-green">
        <div className="bg-brutal-green text-brutal-fg px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h2 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.08em]">👑 白月光神菜榜</h2>
          <span className="text-[9px] sm:text-[10px] opacity-60 uppercase">评分最高 · 全校公投</span>
        </div>
        <div className="divide-y-3 divide-brutal-fg">
          {red.length===0 ? <p className="text-center text-brutal-muted text-sm sm:text-base py-10 sm:py-12">暂无上榜菜品</p> :
            red.map((d,i) => (
              <div key={d.id} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 hover:bg-brutal-secondary/10 transition-colors">
                <span className={`font-extrabold text-lg sm:text-2xl w-6 sm:w-8 text-center shrink-0 ${i===0?"text-brutal-primary":i===1?"text-brutal-muted":i===2?"text-brutal-orange":"text-brutal-muted/30"}`}>{i+1}</span>
                <div className="flex-1 min-w-0"><p className="text-sm sm:text-base font-bold text-brutal-fg truncate">{d.dishName}</p><p className="text-[9px] sm:text-[11px] text-brutal-muted uppercase truncate">{d.stallName} · ¥{d.price}</p></div>
                <div className="flex items-center gap-1 shrink-0"><span className="text-brutal-secondary text-base sm:text-lg">★</span><span className="text-[10px] sm:text-xs font-extrabold text-brutal-green">{d.avgRating!=null?Number(d.avgRating).toFixed(1):"—"}</span><span className="text-[9px] sm:text-[10px] text-brutal-muted">({d.reviewCount})</span></div>
              </div>
            ))}
        </div>
      </section>

      {/* BLACK LIST */}
      <section className="brutal-card-strip-danger">
        <div className="bg-brutal-primary text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h2 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.08em]">💀 避雷黑暗料理榜</h2>
          <span className="text-[9px] sm:text-[10px] opacity-60 uppercase">评分垫底 · 生还者口述</span>
        </div>
        <div className="divide-y-3 divide-brutal-fg">
          {black.length===0 ? <p className="text-center text-brutal-muted text-sm sm:text-base py-10 sm:py-12">暂无黑暗料理 — 今天运气真好！</p> :
            black.map((d,i) => (
              <div key={d.id} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 hover:bg-brutal-primary/5 transition-colors">
                <span className={`font-extrabold text-lg sm:text-2xl w-6 sm:w-8 text-center shrink-0 ${i===0?"text-brutal-primary":i===1?"text-brutal-danger":i===2?"text-brutal-orange":"text-brutal-muted/30"}`}>{i+1}</span>
                <div className="flex-1 min-w-0"><p className="text-sm sm:text-base font-bold text-brutal-fg truncate">{d.dishName}</p><p className="text-[9px] sm:text-[11px] text-brutal-muted uppercase truncate">{d.stallName} · ¥{d.price}</p></div>
                <div className="flex items-center gap-1 shrink-0"><span className="text-brutal-danger text-base sm:text-lg">☠</span><span className="text-[10px] sm:text-xs font-extrabold text-brutal-primary">{d.avgRating!=null?Number(d.avgRating).toFixed(1):"—"}</span><span className="text-[9px] sm:text-[10px] text-brutal-muted">({d.reviewCount})</span></div>
              </div>
            ))}
        </div>
      </section>

      <div className="text-center pb-6 sm:pb-8">
        <button onClick={fetch} className="text-[10px] sm:text-xs text-brutal-muted hover:text-brutal-fg uppercase underline transition-colors min-h-[44px]">刷新红黑榜</button>
      </div>
    </div>
  );
}

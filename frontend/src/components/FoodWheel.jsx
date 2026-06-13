// src/components/FoodWheel.jsx — Retro Pixel Slot Machine (Responsive)
import React, { useState, useRef, useCallback, useEffect } from "react";
import { api } from "../utils/api";
import PixelMario from "./PixelMario";

export default function FoodWheel({ dishes = [], onSpinResult, onViewDetail }) {
  const [phase, setPhase] = useState("idle");
  const [centerIdx, setCenterIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const mounted = useRef(true);
  const spinLock = useRef(false);
  const timerRef = useRef(null);
  const [spinCount, setSpinCount] = useState(0);
  const [lastDish, setLastDish] = useState("---");

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const n = dishes.length;

  const spin = useCallback(async () => {
    if (spinLock.current || phase !== "idle" || n === 0) return;
    spinLock.current = true;
    setShowCard(false); setResult(null); setPhase("spinning");

    let picked = null;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SPIN_TIMEOUT")), 8000)
    );
    try {
      const r = await Promise.race([
        api("/wheel/spin", { method: "POST", body: "{}" }),
        timeout,
      ]);
      picked = r.data;
    } catch {
      picked = {
        ...dishes[Math.floor(Math.random() * n)],
        roastText: "SYSTEM FAILED — 命运替你选了它。认命。",
      };
    }

    if (!picked || !mounted.current) { setPhase("idle"); spinLock.current = false; return; }
    if (!picked.dishId && picked.id) picked.dishId = picked.id;
    setResult(picked);

    const targetIdx = Math.max(0, dishes.findIndex(
      d => (d.id || d.dishId) === (picked.dishId || picked.id)
    ));

    const TOTAL_STEPS = n * 3 + targetIdx;
    const steps = [];
    let idx = centerIdx;
    for (let i = 0; i < TOTAL_STEPS; i++) {
      idx = (idx + 1) % n;
      steps.push(idx);
    }

    const total = steps.length;
    let i = 0;

    const tick = () => {
      if (!mounted.current) { spinLock.current = false; return; }
      if (i >= total) {
        setPhase("done");
        setShowCard(true);
        spinLock.current = false;
        setSpinCount(c => c + 1);
        setLastDish(picked.dishName || picked.name || "???");
        onSpinResult?.(picked);
        return;
      }
      setCenterIdx(steps[i]);
      const progress = i / total;
      let delay;
      if (progress < 0.80)       delay = 35;
      else if (progress < 0.90)  delay = 80;
      else if (progress < 0.95)  delay = 180;
      else                        delay = 350;
      i++;
      timerRef.current = setTimeout(tick, delay);
    };
    tick();
  }, [phase, centerIdx, dishes, n, onSpinResult]);

  const dishAt = (offset) => {
    if (n === 0) return null;
    return dishes[((centerIdx + offset) % n + n) % n];
  };
  const current = dishAt(0), prev = dishAt(-1), next = dishAt(1);

  return (
    <div className="flex flex-col items-center w-full px-4 py-2 sm:py-0">

      <p className="text-label text-brutal-muted mb-4 sm:mb-6 font-mono uppercase tracking-[0.15em] text-center">
        [ 命运老虎机 ]
      </p>

      {/* ── Wrapper: relative for Mario absolute positioning ── */}
      <div className="relative w-full flex justify-center">

        {/* Mario — mobile: inline above; desktop: absolute left side */}
        <div className="md:hidden mb-3">
          <PixelMario px={8} />
        </div>
        <div className="hidden md:block absolute left-0 top-1/2 z-10 scale-90 lg:scale-100"
          style={{ transform: 'translateY(-50%)' }}>
          <PixelMario px={10} />
        </div>

        {/* ═══════ Slot Machine ═══════ */}
        <div
          className="w-full max-w-[280px] sm:max-w-[300px] p-2.5 sm:p-3"
          style={{
            background: '#f4c463',
            border: '4px solid #111111',
            boxShadow: '6px 6px 0 #111111',
          }}
        >
          {/* Top pixel strip */}
          <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3 pb-1.5 sm:pb-2"
            style={{ borderBottom: '3px solid #111111' }}>
            {['#e52521','#f4c463','#002fa7','#00cc66','#ff6600','#8833ff'].map((c,i) => (
              <div key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ background: c, border: '1.5px solid #111' }} />
            ))}
            <span className="text-label text-[#111] font-extrabold ml-1.5 sm:ml-2 tracking-[0.12em] font-mono text-[10px] sm:text-xs">
              老虎机
            </span>
            {['#8833ff','#ff6600','#00cc66','#002fa7','#f4c463','#e52521'].map((c,i) => (
              <div key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ background: c, border: '1.5px solid #111' }} />
            ))}
          </div>

          {/* Viewport */}
          <div className="relative flex items-center" style={{ background: '#FFFDF7', border: '3px solid #111111' }}>
            {/* Left pointer */}
            <div className="flex-shrink-0 flex items-center justify-center w-6 sm:w-7 h-full">
              <div style={{
                width: 0, height: 0,
                borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
                borderRight: '12px solid #e52521',
                filter: 'drop-shadow(1px 1px 0 #111)',
              }} />
            </div>

            {/* 3-row window */}
            <div className="flex-1 py-1.5 sm:py-2 overflow-hidden select-none">
              {/* Prev */}
              <div className="py-1.5 sm:py-2 px-1.5 sm:px-2 opacity-30"
                style={{ borderBottom: '2px solid rgba(17,17,17,0.08)' }}>
                {prev ? (
                  <>
                    <p className="text-label text-brutal-fg font-extrabold truncate text-[11px] sm:text-[13px] tracking-[0.03em]">
                      {prev.dishName || prev.name}
                    </p>
                    <p className="text-mono-sm text-brutal-muted truncate text-[9px] sm:text-[10px]">
                      {prev.stallName} · ¥{prev.price}
                    </p>
                  </>
                ) : <p className="text-mono-sm text-brutal-muted/30 text-[9px]">---</p>}
              </div>

              {/* CENTER — win row */}
              <div className="relative py-2 sm:py-2.5 px-1.5 sm:px-2 my-0.5"
                style={{
                  background: 'rgba(255,211,0,0.12)',
                  borderTop: '2px solid #e52521',
                  borderBottom: '2px solid #e52521',
                }}>
                {current ? (
                  <>
                    <p className="text-body text-brutal-fg font-extrabold truncate text-[13px] sm:text-[15px] tracking-[0.03em]">
                      {current.dishName || current.name}
                    </p>
                    <p className="text-mono-sm text-brutal-muted truncate mt-0.5 text-[10px] sm:text-[11px]">
                      {current.stallName} · ¥{current.price}
                    </p>
                    {current.avgRating != null && current.avgRating > 0 && (
                      <span className="text-brutal-primary font-extrabold text-[9px] sm:text-[10px]">
                        {"★".repeat(Math.round(current.avgRating))}
                      </span>
                    )}
                  </>
                ) : <p className="text-label text-brutal-muted/40 text-center text-[11px]">等待中...</p>}
                {/* Center dots */}
                <div className="absolute -left-[6px] sm:-left-[7px] top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5"
                  style={{background:'#e52521',border:'1px solid #111'}} />
                <div className="absolute -right-[6px] sm:-right-[7px] top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5"
                  style={{background:'#e52521',border:'1px solid #111'}} />
              </div>

              {/* Next */}
              <div className="py-1.5 sm:py-2 px-1.5 sm:px-2 opacity-30"
                style={{ borderTop: '2px solid rgba(17,17,17,0.08)' }}>
                {next ? (
                  <>
                    <p className="text-label text-brutal-fg font-extrabold truncate text-[11px] sm:text-[13px] tracking-[0.03em]">
                      {next.dishName || next.name}
                    </p>
                    <p className="text-mono-sm text-brutal-muted truncate text-[9px] sm:text-[10px]">
                      {next.stallName} · ¥{next.price}
                    </p>
                  </>
                ) : <p className="text-mono-sm text-brutal-muted/30 text-[9px]">---</p>}
              </div>
            </div>

            {/* Right pointer */}
            <div className="flex-shrink-0 flex items-center justify-center w-6 sm:w-7 h-full">
              <div style={{
                width: 0, height: 0,
                borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
                borderLeft: '12px solid #e52521',
                filter: 'drop-shadow(1px 1px 0 #111)',
              }} />
            </div>
          </div>

          {/* Bottom pixel strip */}
          <div className="flex items-center justify-center gap-1 mt-2 sm:mt-3 pt-1.5 sm:pt-2"
            style={{ borderTop: '3px solid #111111' }}>
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="w-1.5 sm:w-2 h-1.5 sm:h-2" style={{ background: i%2===0?'#111':'#e52521' }} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ Lever Button ═══════════ */}
      <button
        onClick={spin}
        disabled={phase !== "idle" || n === 0}
        className="mt-5 sm:mt-8 px-10 sm:px-12 py-3 sm:py-4 text-sm sm:text-lg tracking-[0.08em]
                   font-extrabold uppercase select-none min-h-[48px] min-w-[200px]
                   border-3 bg-[#e52521] text-white cursor-pointer
                   active:translate-x-[2px] active:translate-y-[2px]"
        style={{
          border: '3px solid #111111',
          boxShadow: '4px 4px 0 #111111',
          fontFamily: "'JetBrains Mono', monospace",
          transition: 'all 0.05s ease',
        }}
      >
        {phase === "spinning" ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent animate-spin" style={{borderRadius:'50%'}}/>
            滚动中...
          </span>
        ) : phase === "done" ? "🎯 揭晓!"
         : n === 0 ? "无菜品" : "🕹️ 启动拉杆"}
      </button>

      {/* ═══════════ Arcade Stats & Controller Panel ═══════════ */}
      <div className="w-full max-w-[280px] sm:max-w-[300px] mt-8 pb-8 sm:pb-12">

        {/* ── HP Hearts Bar ── */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[0,1,2].map(i => (
            <PixelHeart key={i} />
          ))}
        </div>

        {/* ── Stats Monitor ── */}
        <div
          className="p-3 sm:p-4 mb-4"
          style={{
            background: '#111111',
            border: '4px solid #1e1e1e',
            boxShadow: '4px 4px 0 #1e1e1e',
          }}
        >
          <div className="space-y-2 font-mono uppercase tracking-[0.06em]">
            <div className="flex justify-between items-center" style={{color:'#00cc66',fontSize:'11px',lineHeight:'1.4'}}>
              <span>{'>'} 抽签次数</span>
              <span className="font-extrabold text-white" style={{fontSize:'14px'}}>{String(spinCount).padStart(4,'0')} 次</span>
            </div>
            <div className="flex justify-between items-center" style={{color:'#ff6600',fontSize:'11px',lineHeight:'1.4'}}>
              <span>{'>'} 最近抽中</span>
              <span className="font-extrabold text-white truncate max-w-[120px] text-right" style={{fontSize:'12px'}}>{lastDish}</span>
            </div>
            <div className="flex justify-between items-center" style={{color:'#f4c463',fontSize:'11px',lineHeight:'1.4'}}>
              <span>{'>'} 金币</span>
              <span className="font-extrabold text-white" style={{fontSize:'14px'}}>999 金</span>
            </div>
          </div>
        </div>

        {/* ── Arcade Controller ── */}
        <div className="flex items-center justify-between px-4">
          {/* Left: Joystick */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-12 h-12 rounded-full cursor-pointer select-none
                         flex items-center justify-center
                         active:translate-y-[2px]"
              style={{
                background: '#e52521',
                border: '2px solid #111111',
                boxShadow: '3px 3px 0 #111111',
                transition: 'all 0.05s ease',
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{background:'#111'}} />
            </div>
            <span className="font-mono text-[9px] uppercase text-brutal-muted/50">摇杆</span>
          </div>

          {/* Right: A / B Buttons */}
          <div className="flex items-center gap-3">
            {/* B Button (Blue) */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full cursor-pointer select-none
                           flex items-center justify-center
                           active:translate-x-[1px] active:translate-y-[2px]"
                style={{
                  background: '#002fa7',
                  border: '2px solid #111111',
                  boxShadow: '3px 3px 0 #111111',
                  transition: 'all 0.05s ease',
                }}
                onClick={() => { setShowCard(false); setPhase("idle"); }}
              >
                <span className="font-extrabold font-mono text-sm text-white">B</span>
              </div>
              <span className="font-mono text-[9px] uppercase text-brutal-muted/50">重置</span>
            </div>

            {/* A Button (Red) */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full cursor-pointer select-none
                           flex items-center justify-center
                           active:translate-x-[1px] active:translate-y-[2px]"
                style={{
                  background: '#e52521',
                  border: '2px solid #111111',
                  boxShadow: '3px 3px 0 #111111',
                  transition: 'all 0.05s ease',
                }}
                onClick={spin}
              >
                <span className="font-extrabold font-mono text-sm text-white">A</span>
              </div>
              <span className="font-mono text-[9px] uppercase text-brutal-muted/50">抽签!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {showCard && result && (
        <RoastCard
          result={result}
          onClose={() => { setShowCard(false); setPhase("idle"); }}
          onViewDetail={onViewDetail}
        />
      )}
    </div>
  );
}

/** Pixel Heart — 8-bit style with hard black outline */
function PixelHeart() {
  return (
    <span
      className="inline-block animate-pulse select-none"
      style={{
        fontSize: '26px',
        lineHeight: 1,
        color: '#e52521',
        textShadow: [
          '1px 1px 0 #111', '-1px 1px 0 #111',
          '1px -1px 0 #111', '-1px -1px 0 #111',
          '2px 0 0 #111', '-2px 0 0 #111',
          '0 2px 0 #111', '0 -2px 0 #111',
        ].join(', '),
      }}
    >♥</span>
  );
}

function RoastCard({ result, onClose, onViewDetail }) {
  const r = result.avgRating || 3;
  const tier = r >= 4 ? "good" : r < 2.5 ? "bad" : "mid";
  const strip = { good: "brutal-card-strip-green", bad: "brutal-card-strip-danger", mid: "brutal-card-strip-secondary" }[tier];
  const txt  = { good: "text-brutal-green", bad: "text-brutal-primary", mid: "text-brutal-orange" }[tier];

  return (
    <div className="brutal-overlay">
      <div className="brutal-modal animate-pop-in mx-2">
        <div className={strip}>
          <div className="p-4 sm:p-6">
            <h3 className="text-title text-brutal-fg text-center mb-1 text-lg sm:text-2xl">{result.dishName}</h3>
            <p className="text-body text-brutal-muted text-center mb-5 text-sm sm:text-base">
              {result.stallName && `${result.stallName} · `}{result.price != null && `¥${result.price}`}
            </p>
            {result.avgRating != null && (
              <div className="flex items-center justify-center gap-1 mb-5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-lg sm:text-xl ${s <= Math.round(r) ? txt : "text-brutal-muted/30"}`}>★</span>
                ))}
                <span className={`ml-2 font-extrabold text-xl sm:text-2xl ${txt}`}>{Number(r).toFixed(1)}</span>
              </div>
            )}
            <div className="border-3 border-brutal-fg p-3 sm:p-4 mb-4 sm:mb-6 bg-brutal-bg">
              <p className="text-body text-brutal-fg/70 italic leading-relaxed text-sm sm:text-base">
                {result.roastText || "今天的命运没说啥，你自己看着办吧。"}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 sm:py-3 brutal-btn-ghost text-label min-h-[44px]">再抽一次</button>
              <button onClick={() => onViewDetail?.(result)} className="flex-1 py-2.5 sm:py-3 brutal-btn-secondary text-label min-h-[44px]">我看点评</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

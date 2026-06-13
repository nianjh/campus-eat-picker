// src/pages/AdminPage.jsx — Neo-Brutalist Admin (Responsive)
import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export default function AdminPage({ onDishChanged }) {
  const [tab, setTab] = useState("reports");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [dishes, setDishes] = useState([]);
  const [dLoading, setDLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sLoading, setSLoading] = useState(false);
  const [fName, setFName] = useState(""); const [fStall, setFStall] = useState(""); const [fCanteen, setFCanteen] = useState("");
  const [fFloor, setFFloor] = useState(1); const [fPrice, setFPrice] = useState(""); const [fWeight, setFWeight] = useState("1.0");
  const [fSub, setFSub] = useState(false);
  const [editing, setEditing] = useState(null); const [ePrice, setEPrice] = useState(""); const [eWeight, setEWeight] = useState("");

  const fetchAll = useCallback(async () => { setLoading(true);setError("");try{const r=await api("/admin/comment/all");setComments(r.data||[])}catch(e){setError(e.message||"FAILED")}finally{setLoading(false)} },[]);
  const fetchRep = useCallback(async () => { setLoading(true);setError("");try{const r=await api("/admin/comment/reported");setComments(r.data||[])}catch(e){setError(e.message||"FAILED")}finally{setLoading(false)} },[]);
  const fetchDishes = useCallback(async () => { setDLoading(true);try{const r=await api("/dish/candidates");setDishes(r.data||[])}catch{}finally{setDLoading(false)} },[]);
  const fetchSuggestions = useCallback(async () => { setSLoading(true);try{const r=await api("/admin/suggestion");setSuggestions(r.data||[])}catch{}finally{setSLoading(false)} },[]);
  useEffect(() => { setError("");setActionMsg("");setComments([]);if(tab==="all")fetchAll();if(tab==="reports")fetchRep();if(tab==="dishes")fetchDishes();if(tab==="suggestions")fetchSuggestions(); },[tab,fetchAll,fetchRep,fetchDishes,fetchSuggestions]);

  const hideC = async id => { setActionMsg("");try{await api(`/admin/comment/${id}`,{method:"DELETE"});setActionMsg(`评论 #${id} 已斩杀`);setTimeout(()=>fetchRep(),500)}catch(e){setError(e.message||"FAILED")} };
  const banU = async (uid,nick) => { if(!window.confirm(`封禁「${nick}」？`))return;setActionMsg("");try{await api(`/admin/user/ban/${uid}`,{method:"POST"});setActionMsg(`「${nick}」已被封印。`)}catch(e){setError(e.message||"FAILED")} };
  const createD = async e => { e.preventDefault();if(!fName.trim()||!fStall.trim()||!fCanteen.trim()||!fPrice){setError("必填项不能为空");return;}setFSub(true);setError("");setActionMsg("");try{await api("/admin/dish",{method:"POST",body:JSON.stringify({dishName:fName.trim(),stallName:fStall.trim(),canteenName:fCanteen.trim(),floorNum:fFloor,price:parseFloat(fPrice),weightFactor:parseFloat(fWeight)||1.0})});setActionMsg(`「${fName}」已录入！`);setFName("");setFStall("");setFCanteen("");setFFloor(1);setFPrice("");setFWeight("1.0");fetchDishes();onDishChanged?.()}catch(e){setError(e.message||"FAILED")}finally{setFSub(false)} };
  const updateD = async d => { const did = d.id || d.dishId; setError("");setActionMsg("");try{await api("/admin/dish",{method:"PUT",body:JSON.stringify({id:did,price:parseFloat(ePrice),weightFactor:parseFloat(eWeight)||1.0})});setActionMsg(`「${d.dishName}」已更新`);setEditing(null);fetchDishes();onDishChanged?.()}catch(e){setError(e.message||"FAILED")} };
  const deleteD = async d => { const did = d.id || d.dishId; if(!window.confirm(`下架「${d.dishName}」？`))return;setError("");setActionMsg("");try{await api(`/admin/dish/${did}`,{method:"DELETE"});setActionMsg(`「${d.dishName}」已下架`);fetchDishes();onDishChanged?.()}catch(e){setError(e.message||"FAILED")} };
  const handleSuggestion = async (id, status) => { setActionMsg("");try{await api(`/admin/suggestion/${id}`,{method:"PUT",body:JSON.stringify({status})});setActionMsg(`投稿 #${id} 已${status==="REVIEWED"?"标记已阅":"关闭"}`);fetchSuggestions()}catch(e){setError(e.message||"FAILED")} };

  const TABS = [{k:"all",l:"💬 全部",bg:"bg-brutal-blue"},{k:"reports",l:"🚨 举报",bg:"bg-brutal-primary"},{k:"dishes",l:"🎡 菜品",bg:"bg-brutal-fg"},{k:"suggestions",l:"💡 投稿",bg:"bg-brutal-green"}];

  return (
    <div className="min-h-screen -mx-3 sm:-mx-6 -mt-6 sm:-mt-10 bg-brutal-bg">
      <header className="brutal-nav bg-white">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-extrabold text-brutal-fg">⚔️ 食堂审判庭</h1>
          <span className="brutal-badge-red text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">ADMIN</span>
        </div>
      </header>

      {/* Tab bar — responsive */}
      <div className="max-w-2xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="flex border-3 border-brutal-fg overflow-x-auto">
          {TABS.map(({k,l,bg})=>(
            <button key={k} onClick={()=>setTab(k)}
              className={`flex-1 py-2 sm:py-3 text-[9px] sm:text-xs uppercase font-extrabold transition-colors whitespace-nowrap ${tab===k?`${bg} text-white`:"bg-white text-brutal-fg hover:bg-brutal-bg"}`}>{l}</button>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {actionMsg && <div className="mb-4 border-3 border-brutal-green bg-brutal-green/10 text-brutal-green text-[10px] sm:text-xs text-center py-2 sm:py-3 px-3 sm:px-4 uppercase font-extrabold">{actionMsg}</div>}
        {error && <div className="mb-4 border-3 border-brutal-danger bg-brutal-danger/10 text-brutal-danger text-[10px] sm:text-xs text-center py-2 sm:py-3 px-3 sm:px-4 uppercase font-extrabold">{error}</div>}

        {(tab==="all"||tab==="reports") && (
          <div className="space-y-3 sm:space-y-4">
            {loading && <div className="text-center py-10 sm:py-12"><p className="text-3xl sm:text-4xl">🔍</p><p className="text-[10px] sm:text-xs text-brutal-muted mt-2 uppercase font-mono">SCANNING...</p></div>}
            {!loading && comments.length===0 && <div className="brutal-card text-center py-10 sm:py-12"><p className="text-4xl sm:text-5xl mb-2">🕊️</p><p className="text-sm sm:text-base text-brutal-muted uppercase">{tab==="all"?"没有评论":"世界和平，暂无举报"}</p></div>}
            {!loading && comments.map(c => (
              <div key={c.id} className="brutal-card p-3 sm:p-5">
                <p className="text-sm sm:text-base text-brutal-fg/70 leading-relaxed mb-2 sm:mb-3">{c.content||"（无内容）"}</p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs mb-2 sm:mb-3">
                  <span className="brutal-badge-yellow">{"★".repeat(c.rating||0)}{"☆".repeat(5-(c.rating||0))}</span>
                  <span className="text-brutal-muted font-mono">UID:{c.userId}</span>
                  <span className="text-brutal-muted font-mono">DID:{c.dishId}</span>
                  <span className="brutal-badge-red text-[9px] sm:text-[10px]">🚩 {c.reportCount}次</span>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <button onClick={()=>hideC(c.id)} className="flex-1 py-2 sm:py-2.5 brutal-btn-primary text-[10px] sm:text-xs uppercase tracking-[0.06em] min-h-[40px] sm:min-h-[44px]">⚔️ 斩杀此评</button>
                  <button onClick={()=>banU(c.userId,`UID${c.userId}`)} className="flex-1 py-2 sm:py-2.5 brutal-btn-ghost text-[10px] sm:text-xs min-h-[40px] sm:min-h-[44px]">🔒 封印此魂</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="dishes" && (
          <div className="space-y-4 sm:space-y-6">
            <form onSubmit={createD} className="brutal-card p-3 sm:p-5 space-y-2 sm:space-y-3">
              <h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em]">📝 录入新菜品</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <input placeholder="菜品名称" value={fName} onChange={e=>setFName(e.target.value)} className="brutal-input text-sm py-2.5" />
                <input placeholder="档口名称" value={fStall} onChange={e=>setFStall(e.target.value)} className="brutal-input text-sm py-2.5" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <input placeholder="食堂" value={fCanteen} onChange={e=>setFCanteen(e.target.value)} className="brutal-input text-sm py-2.5" />
                <input type="number" placeholder="楼层" value={fFloor} onChange={e=>setFFloor(parseInt(e.target.value)||1)} className="brutal-input text-sm py-2.5" />
                <input type="number" step="0.01" placeholder="价格 ¥" value={fPrice} onChange={e=>setFPrice(e.target.value)} className="brutal-input text-sm py-2.5" />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <input type="number" step="0.1" placeholder="权重" value={fWeight} onChange={e=>setFWeight(e.target.value)} className="brutal-input w-full sm:w-28 text-sm py-2.5" />
                <button type="submit" disabled={fSub} className="flex-1 py-2.5 sm:py-3 brutal-btn-primary text-[10px] sm:text-xs uppercase tracking-[0.06em] min-h-[44px]">{fSub?"录入中...":"✅ 录入转盘池"}</button>
              </div>
            </form>

            <div className="brutal-card overflow-hidden">
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b-3 border-brutal-fg"><h3 className="text-[10px] sm:text-xs text-brutal-fg uppercase tracking-[0.08em]">📋 转盘池菜品 ({dishes.length})</h3></div>
              {dLoading ? <p className="text-center text-brutal-muted text-sm sm:text-base py-8 sm:py-10">加载中...</p>
               : dishes.length===0 ? <p className="text-center text-brutal-muted text-sm sm:text-base py-8 sm:py-10">转盘池为空</p>
               : <div className="divide-y-3 divide-brutal-fg">{dishes.map(d=>(
                <div key={d.id || d.dishId} className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 hover:bg-brutal-bg transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-brutal-fg truncate">{d.dishName}</p>
                    <p className="text-[9px] sm:text-[11px] text-brutal-muted uppercase">{d.stallName} · {d.canteenName} · ¥{d.price}</p>
                    <p className="text-[10px] sm:text-xs text-brutal-muted">W:{d.weightFactor??"1.0"} | ★:{d.avgRating!=null?Number(d.avgRating).toFixed(1):"—"}</p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 self-end sm:self-auto">
                    <button onClick={()=>{setEditing(d);setEPrice(String(d.price||""));setEWeight(String(d.weightFactor!=null?d.weightFactor:"1.0"));}} className="brutal-badge-blue text-[9px] sm:text-[10px] cursor-pointer px-2 py-0.5">调整</button>
                    <button onClick={()=>deleteD(d)} className="brutal-badge-red text-[9px] sm:text-[10px] cursor-pointer px-2 py-0.5">下架</button>
                  </div>
                </div>
              ))}</div>}
            </div>
          </div>
        )}

        {tab==="suggestions" && (
          <div className="space-y-3 sm:space-y-4">
            {sLoading && <div className="text-center py-10 sm:py-12"><p className="text-3xl sm:text-4xl">📬</p><p className="text-[10px] sm:text-xs text-brutal-muted mt-2 uppercase font-mono">LOADING...</p></div>}
            {!sLoading && suggestions.length===0 && <div className="brutal-card text-center py-10 sm:py-12"><p className="text-4xl sm:text-5xl mb-2">📭</p><p className="text-sm sm:text-base text-brutal-muted uppercase">暂无用户投稿</p></div>}
            {!sLoading && suggestions.map(s => {
              const typeLabel = {NEW_DISH:"🍱 好吃投稿",SUGGEST:"💡 改进建议",FEEDBACK:"📢 意见反馈"}[s.suggType]||s.suggType;
              const statusBadge = s.suggStatus==="PENDING"?"brutal-badge-yellow":s.suggStatus==="REVIEWED"?"brutal-badge-green":"brutal-badge-dark";
              const statusText = {PENDING:"待处理",REVIEWED:"已阅",CLOSED:"已关闭"}[s.suggStatus]||s.suggStatus;
              return (
                <div key={s.id} className="brutal-card p-3 sm:p-5">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    <span className="brutal-badge-blue text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">{typeLabel}</span>
                    <span className={statusBadge+" text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5"}>{statusText}</span>
                    <span className="text-[10px] sm:text-xs text-brutal-muted ml-auto">{s.createTime||""}</span>
                  </div>
                  <p className="text-sm sm:text-base text-brutal-fg/70 leading-relaxed mb-2">{s.content}</p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                    <span className="text-brutal-muted font-mono">来自: {s.nickname}</span>
                    <span className="text-brutal-muted/50 font-mono">UID:{s.userId}</span>
                  </div>
                  {s.adminNote && <p className="mt-2 text-[10px] sm:text-xs text-brutal-muted font-mono border-t-3 border-brutal-fg/10 pt-2">备注: {s.adminNote}</p>}
                  {s.suggStatus === "PENDING" && (
                    <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                      <button onClick={()=>handleSuggestion(s.id,"REVIEWED")} className="flex-1 py-2 brutal-btn-secondary text-[9px] sm:text-[10px] uppercase min-h-[40px]">✅ 标记已阅</button>
                      <button onClick={()=>handleSuggestion(s.id,"CLOSED")} className="flex-1 py-2 brutal-btn-ghost text-[9px] sm:text-[10px] uppercase min-h-[40px]">🚫 关闭</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit modal */}
      {editing && (
        <div className="brutal-overlay" onClick={()=>setEditing(null)}>
          <div className="brutal-modal p-4 sm:p-6 animate-pop-in mx-2" onClick={e=>e.stopPropagation()}>
            <div className="h-[6px] bg-brutal-fg -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-2xl text-brutal-fg mb-1">{editing.dishName}</h3>
            <p className="text-[10px] sm:text-xs text-brutal-muted mb-4 sm:mb-5 uppercase">{editing.stallName} · {editing.canteenName}</p>
            <div className="space-y-3 sm:space-y-4">
              <div><label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 sm:mb-1.5 font-mono">PRICE ¥</label><input type="number" step="0.01" value={ePrice} onChange={e=>setEPrice(e.target.value)} className="brutal-input" /></div>
              <div><label className="block text-[10px] sm:text-xs text-brutal-fg/60 uppercase mb-1 sm:mb-1.5 font-mono">WEIGHT</label><input type="number" step="0.1" value={eWeight} onChange={e=>setEWeight(e.target.value)} className="brutal-input" /></div>
              <div className="flex gap-1.5 sm:gap-2 pt-1">
                <button onClick={()=>setEditing(null)} className="flex-1 py-2.5 sm:py-3 brutal-btn-ghost text-[10px] sm:text-xs uppercase min-h-[44px]">取消</button>
                <button onClick={()=>updateD(editing)} className="flex-1 py-2.5 sm:py-3 brutal-btn-primary text-[10px] sm:text-xs uppercase min-h-[44px]">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

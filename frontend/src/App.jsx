// src/App.jsx — Neo-Brutalist Shell (Responsive)
import React, { useState, useEffect, useCallback } from "react";
import { getAuthUser, clearAuth, api } from "./utils/api";
import AuthModal from "./components/AuthModal";
import FoodWheel from "./components/FoodWheel";
import AdminPage from "./pages/AdminPage";
import DishDetailPage from "./pages/DishDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SuggestionModal from "./components/SuggestionModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [currentView, setCurrentView] = useState("wheel");
  const [selectedDish, setSelectedDish] = useState(null);
  const [realDishes, setRealDishes] = useState([]);
  const [dishesLoading, setDishesLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    const s = getAuthUser();
    if (s?.userId && s?.nickname) { setUser(s); setInitDone(true); }
    else { setShowAuth(true); setInitDone(true); }
  }, []);

  const fetchDishes = useCallback(async () => {
    setDishesLoading(true);
    try { const r = await api("/dish/candidates"); setRealDishes(r.data?.length ? r.data : FALLBACK); }
    catch { setRealDishes(FALLBACK); }
    finally { setDishesLoading(false); }
  }, []);
  useEffect(() => { if (user) fetchDishes(); }, [user, fetchDishes]);

  const FALLBACK = [
    { id:1,dishName:"黄焖鸡米饭",stallName:"二楼黄焖鸡",price:15,avgRating:4.2 },
    { id:2,dishName:"麻辣香锅",stallName:"一楼香锅王",price:28,avgRating:3.8 },
    { id:3,dishName:"石锅拌饭",stallName:"韩式档口",price:18,avgRating:4.5 },
    { id:4,dishName:"番茄鸡蛋面",stallName:"面馆老张",price:10,avgRating:3.2 },
    { id:5,dishName:"炸鸡汉堡套餐",stallName:"西餐窗口",price:22,avgRating:2.1 },
    { id:6,dishName:"螺蛳粉",stallName:"广西味道",price:14,avgRating:1.8 },
    { id:7,dishName:"铁板牛肉饭",stallName:"铁板烧档口",price:25,avgRating:3.9 },
    { id:8,dishName:"麻辣烫",stallName:"自选麻辣烫",price:20,avgRating:3.5 },
    { id:9,dishName:"烤鱼饭",stallName:"三楼烤鱼",price:32,avgRating:4.0 },
    { id:10,dishName:"鸡蛋灌饼",stallName:"早餐铺",price:7,avgRating:4.7 },
  ];

  if (!initDone) return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg">
      <div className="text-center animate-pop-in">
        <p className="text-6xl mb-4">🍳</p>
        <p className="text-label uppercase text-brutal-muted">食堂正在开火...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brutal-bg">
      {/* ── Navigation ── */}
      <header className="brutal-nav">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-3 sm:py-4
                        flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-brutal-fg cursor-pointer select-none shrink-0"
            onClick={() => { setCurrentView("wheel"); setSelectedDish(null); }}>
            {currentView === "admin" ? "⚔️ 审判庭" : currentView === "detail" ? "← 返回" : currentView === "profile" ? "📂 个人" : "🍔 今天吃什么"}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
            {user ? (<>
              {user.userRole === "ADMIN" && (
                <button onClick={() => setCurrentView(currentView === "wheel" ? "admin" : "wheel")}
                  className="brutal-badge-yellow cursor-pointer text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
                  {currentView === "wheel" ? "审判庭" : "大转盘"}
                </button>
              )}
              <button onClick={() => setShowSuggestion(true)}
                className="brutal-btn-ghost px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs uppercase"
                title="好吃投稿 / 意见反馈">💡 投稿</button>
              <span className="brutal-badge-blue cursor-pointer hover:scale-105 transition-transform text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1"
                    onClick={() => setCurrentView(currentView === "profile" ? "wheel" : "profile")}
                    title="个人主页">{user.nickname}</span>
              <button onClick={() => { clearAuth(); setUser(null); setCurrentView("wheel"); setRealDishes([]); setShowAuth(true); }}
                className="text-[10px] sm:text-xs text-brutal-muted hover:text-brutal-fg transition-colors font-bold uppercase">退出</button>
            </>) : (
              <button onClick={() => setShowAuth(true)} className="brutal-btn-primary px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs">
                登录 / 投胎
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto py-4 sm:py-10 px-3 sm:px-6">
        {!user && !showAuth && (
          <div className="text-center py-16 sm:py-24">
            <p className="text-5xl sm:text-7xl mb-4 sm:mb-6">👻</p>
            <p className="text-sm sm:text-base text-brutal-muted mb-1">你现在是食堂的孤魂野鬼</p>
            <p className="text-[10px] sm:text-xs text-brutal-muted/60 mb-6 sm:mb-8 uppercase">投个胎，获得花名，才能开转盘</p>
            <button onClick={() => setShowAuth(true)} className="brutal-btn-primary px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-lg uppercase">
              🎲 一键投胎
            </button>
          </div>
        )}

        {user && currentView === "wheel" && (
          dishesLoading ? (
            <div className="text-center py-16 sm:py-20"><p className="text-4xl sm:text-5xl">🍳</p><p className="text-[10px] sm:text-xs text-brutal-muted mt-3 sm:mt-4 uppercase">正在后厨备菜...</p></div>
          ) : (
            <FoodWheel dishes={realDishes}
              onSpinResult={d => console.log("抽中:", d)}
              onViewDetail={d => { setSelectedDish(d); setCurrentView("detail"); }} />
          )
        )}

        {user && currentView === "profile" && (
          <ProfilePage onBack={() => setCurrentView("wheel")} />
        )}
        {user && currentView === "admin" && <AdminPage onDishChanged={fetchDishes} />}
        {user && currentView === "detail" && selectedDish && (
          <DishDetailPage dish={selectedDish} user={user}
            onBack={() => { setCurrentView("wheel"); setSelectedDish(null); }} />
        )}
      </main>

      {showAuth && <AuthModal onClose={() => { if (user) setShowAuth(false); }} onAuthSuccess={({ userId, nickname, userRole, welcomeMessage }) => { setUser({ userId, nickname, userRole }); setShowAuth(false); if (welcomeMessage) alert(welcomeMessage); }} />}
      {showSuggestion && <SuggestionModal onClose={() => setShowSuggestion(false)} />}
    </div>
  );
}

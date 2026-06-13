// src/components/SuggestionModal.jsx — Neo-Brutalist Suggestion Box
import React, { useState } from "react";
import { api } from "../utils/api";

const TYPES = [
  { key: "NEW_DISH",  label: "🍱 好吃投稿", desc: "推荐一道食堂隐藏好菜" },
  { key: "SUGGEST",   label: "💡 改进建议", desc: "提个建议让食堂更好" },
  { key: "FEEDBACK",  label: "📢 意见反馈", desc: "吐槽或反馈问题" },
];

export default function SuggestionModal({ onClose }) {
  const [type, setType] = useState("NEW_DISH");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 5) { setError("至少写5个字吧，别太敷衍！"); return; }
    setLoading(true); setError("");
    try {
      await api("/suggestion", { method: "POST", body: JSON.stringify({ suggType: type, content: content.trim() }) });
      setDone(true);
    }
    catch (err) { setError(err.message || "SUBMIT_FAILED"); }
    finally { setLoading(false); }
  };

  const active = TYPES.find(t => t.key === type);

  return (
    <div className="brutal-overlay" onClick={onClose}>
      <div className="brutal-modal animate-pop-in" onClick={e => e.stopPropagation()}>
        <div className="h-[6px] bg-brutal-fg" />
        <div className="p-6">
          <h2 className="text-title text-brutal-fg text-center mb-1">
            {done ? "✅ 投稿成功！" : "📬 给食堂提意见"}
          </h2>
          <p className="text-label text-brutal-muted text-center mb-6">
            {done ? "管理员会认真看每一条投稿，谢谢你的参与！" : "好吃推荐、改进建议、意见反馈——随便写"}
          </p>

          {done ? (
            <div className="space-y-4">
              <div className="border-3 border-brutal-green bg-brutal-green/10 p-6 text-center">
                <p className="text-5xl mb-3">📬</p>
                <p className="text-body text-brutal-fg font-bold">{active?.label}</p>
                <p className="text-label text-brutal-muted mt-1">已送达食堂管理层</p>
              </div>
              <button onClick={onClose} className="w-full py-3 brutal-btn-primary text-label uppercase">关闭</button>
            </div>
          ) : (<>
            {/* Type selector */}
            <div className="flex border-3 border-brutal-fg mb-6">
              {TYPES.map(({ key, label }) => (
                <button key={key} type="button" onClick={() => { setType(key); setError(""); }}
                  className={`flex-1 py-3 text-label uppercase transition-colors ${type === key ? "bg-brutal-fg text-white" : "bg-white text-brutal-fg hover:bg-brutal-bg"}`}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-3 border-brutal-fg bg-brutal-bg p-4 text-center">
                <p className="text-body text-brutal-fg/70">{active?.desc}</p>
              </div>
              <div>
                <label className="block text-label text-brutal-fg/60 uppercase mb-1.5 font-mono">内容</label>
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  placeholder="写点什么吧...至少5个字"
                  maxLength={2000}
                  className="brutal-input h-32 resize-none" />
                <p className="text-mono-sm text-brutal-muted mt-1 text-right">{content.length}/2000</p>
              </div>
              {error && <div className="brutal-badge-danger text-center w-full py-2">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-4 brutal-btn-primary text-lg uppercase tracking-[0.06em]">
                {loading ? "投递中..." : "📬 投递到食堂管理层"}
              </button>
            </form>
          </>)}
        </div>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-3 border-brutal-fg bg-white text-brutal-fg font-bold hover:bg-brutal-fg hover:text-white transition-colors">✕</button>
      </div>
    </div>
  );
}

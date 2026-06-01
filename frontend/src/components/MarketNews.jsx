import { useEffect, useMemo } from "react";
import { useNews } from "../store/newsStore";

export default function MarketNews() {
  const { feed, sentiment, error, fetchNews, unreadCount, markAllRead } = useNews();

  useEffect(() => {
    fetchNews();
    // store starts polling automatically, but ensure we sync once on mount
  }, [fetchNews]);

  const percentage = useMemo(() => Math.round(((sentiment.score + 1) / 2) * 100), [sentiment.score]);

  const sentimentColor = (score) => {
    if (score >= 0.35) return "bg-emerald-500";
    if (score <= -0.35) return "bg-rose-500";
    return "bg-slate-500";
  };

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Intelligence Feed</span>
            <h1 className="text-2xl font-display font-black text-[hsl(var(--text-main))]">Market News & Sentiment</h1>
            <p className="text-xs text-[hsl(var(--text-muted))]">Live sentiment analyzer feeds · Unread: <span className="font-bold text-rose-400">{unreadCount}</span></p>
          </div>
          <button 
            onClick={markAllRead} 
            className="self-start sm:self-center bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] px-4 py-2.5 rounded-xl text-xs font-bold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/80 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        
        {/* Sentiment Pulse Monitor */}
        <section className="glass-panel rounded-3xl border border-[var(--border-glass)] p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Pulse Index</span>
              <h2 className="text-xl font-display font-black text-[hsl(var(--text-main))]">Live Sentiment Meter</h2>
            </div>
            <span className="rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-4 py-2 text-xs font-bold font-mono">
              {sentiment.label}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-[hsl(var(--color-tertiary))]/50 border border-[var(--border-glass)] p-5">
            <div className="flex items-center justify-between text-xs font-bold text-[hsl(var(--text-muted))]">
              <span>Overall Market Sentiment</span>
              <span className="font-mono">{percentage}% Confidence</span>
            </div>
            <div className="mt-3 h-3.5 rounded-full bg-[hsl(var(--color-tertiary))] overflow-hidden border border-[var(--border-glass)]">
              <div className={`h-full rounded-full transition-all duration-500 ${sentimentColor(sentiment.score)}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[hsl(var(--color-tertiary))]/30 border border-[var(--border-glass)] p-4 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Bullish Signals</p>
              <p className="mt-2 text-3xl font-display font-black text-emerald-400 neon-text-green font-mono">{sentiment.bullishCount}</p>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--color-tertiary))]/30 border border-[var(--border-glass)] p-4 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Bearish Signals</p>
              <p className="mt-2 text-3xl font-display font-black text-rose-400 neon-text-red font-mono">{sentiment.bearishCount}</p>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--color-tertiary))]/30 border border-[var(--border-glass)] p-4 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Neutral Signals</p>
              <p className="mt-2 text-3xl font-display font-black text-[hsl(var(--text-main))] font-mono">{sentiment.neutralCount}</p>
            </div>
          </div>
        </section>

        {/* Live Market headlines widget */}
        <section className="glass-panel rounded-3xl border border-[var(--border-glass)] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Exchange News</span>
              <h2 className="text-lg font-display font-black text-[hsl(var(--text-main))]">Trending Headings</h2>
            </div>
            <span className="rounded-full bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] px-3 py-1 text-[10px] font-bold text-[hsl(var(--text-muted))]">
              {feed.length} Stories
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/40 p-4 grow flex items-center justify-center">
            <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed text-center font-medium">
              {error || 'Live Headlines are compiled continuously from listed feeds to reflect simulated asset volatility.'}
            </p>
          </div>
        </section>
      </div>

      {/* News Article Feed */}
      <section className="space-y-6 mt-6">
        {feed.map((item) => (
          <article key={item.id} className="glass-panel glass-panel-hover rounded-3xl border border-[var(--border-glass)] p-6 shadow-xl transition-all duration-300">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-lg font-black font-display">
                  {item.platform.slice(0, 1).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-display font-bold text-[hsl(var(--text-main))]">{item.author}</p>
                  <p className="text-[10px] text-[hsl(var(--text-muted))] font-medium">{item.handle} · {item.time}</p>
                </div>
              </div>
              
              <span className={`self-start sm:self-center rounded-full px-3 py-1 text-[9px] font-black tracking-wider ${
                item.sentiment === "bullish"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                  : item.sentiment === "bearish"
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                  : "bg-[hsl(var(--color-tertiary))] text-[hsl(var(--text-muted))] border border-[var(--border-glass)]"
              }`}>
                {item.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-display font-extrabold text-[hsl(var(--text-main))] leading-snug tracking-tight">{item.headline}</h3>
              <p className="text-xs leading-relaxed text-[hsl(var(--text-muted))] font-medium">{item.summary}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[hsl(var(--color-tertiary))]/60 border border-[var(--border-glass)] px-2.5 py-1 text-[9px] font-bold text-[hsl(var(--text-muted))]">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}


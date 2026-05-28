import { useEffect, useMemo } from "react";
import { useNews } from "../store/newsStore";

export default function MarketNews() {
  const { feed, sentiment, loading, error, fetchNews, unreadCount, markAllRead } = useNews();

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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Market News & Sentiment</h1>
          <p className="text-sm text-slate-500">Live feed updated periodically — unread: {unreadCount}</p>
        </div>
        <div>
          <button onClick={markAllRead} className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Mark all read</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl bg-slate-950/95 border border-slate-800 p-6 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Market Sentiment Pulse</p>
              <h2 className="mt-3 text-3xl font-semibold">Live News & Sentiment Meter</h2>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100">
              {sentiment.label}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-900/90 p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Overall sentiment</span>
              <span>{percentage}% confidence</span>
            </div>
            <div className="mt-3 h-4 rounded-full bg-slate-800">
              <div className={`h-4 rounded-full ${sentimentColor(sentiment.score)}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Bullish</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-400">{sentiment.bullishCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Bearish</p>
              <p className="mt-3 text-3xl font-semibold text-rose-400">{sentiment.bearishCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Neutral</p>
              <p className="mt-3 text-3xl font-semibold text-slate-200">{sentiment.neutralCount}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Live Market Feed</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Trending News Stories</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              {feed.length} items
            </span>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{error || 'Live headlines are fetched from the backend to mirror a real market stream.'}</p>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        {feed.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  {item.platform.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.author}</p>
                  <p className="text-xs text-slate-500">{item.handle} · {item.time}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.sentiment === "bullish"
                  ? "bg-emerald-100 text-emerald-700"
                  : item.sentiment === "bearish"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-slate-100 text-slate-700"
              }`}>
                {item.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">{item.headline}</h3>
              <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

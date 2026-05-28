import { create } from 'zustand';
import baseAPI from '../components/config/baseAPI';

const LOCAL_KEY = 'tradepro.news.lastSeen';

function parseIdTimestamp(id) {
  // id format: news-<assetId>-<timestamp>
  const parts = String(id).split('-');
  const ts = parts[parts.length - 1];
  const n = Number(ts);
  return isNaN(n) ? Date.now() : n;
}

export const useNews = create((set, get) => ({
  feed: [],
  sentiment: { label: 'Neutral', score: 0, bullishCount: 0, bearishCount: 0, neutralCount: 0, confidence: 50 },
  loading: false,
  error: null,
  unreadCount: 0,
  lastSeen: Number(localStorage.getItem(LOCAL_KEY)) || Date.now(),

  fetchNews: async () => {
    set({ loading: true });
    try {
      const res = await baseAPI.get('/api/market/news');
      const payload = res.data?.payload;

      const feed = Array.isArray(payload?.feed) ? payload.feed : (payload?.feed || []);
      const sentiment = payload?.sentiment || get().sentiment;

      // Compute unread by comparing id timestamps with lastSeen
      const lastSeen = get().lastSeen || Date.now();
      const unreadCount = feed.reduce((acc, item) => {
        const ts = parseIdTimestamp(item.id);
        return acc + (ts > lastSeen ? 1 : 0);
      }, 0);

      set({ feed, sentiment, loading: false, error: null, unreadCount });
    } catch (err) {
      console.error('newsStore fetch failed', err);
      set({ loading: false, error: err.message || 'Failed to fetch news' });
    }
  },

  markAllRead: () => {
    const now = Date.now();
    localStorage.setItem(LOCAL_KEY, String(now));
    set({ lastSeen: now, unreadCount: 0 });
  },

  startPolling: () => {
    // Avoid multiple intervals
    if (get()._pollingId) return;
    get().fetchNews();
    const id = setInterval(() => {
      get().fetchNews();
    }, 20000);
    set({ _pollingId: id });
  },

  stopPolling: () => {
    const id = get()._pollingId;
    if (id) clearInterval(id);
    set({ _pollingId: null });
  }
}));

// Start polling immediately in browser runtime
if (typeof window !== 'undefined') {
  try {
    const store = useNews.getState();
    store.startPolling();
  } catch (e) {
    // ignore when used in SSR or tests
  }
}

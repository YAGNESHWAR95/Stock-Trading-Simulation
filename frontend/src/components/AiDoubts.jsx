import { useState } from "react";
import baseAPI from "./config/baseAPI";

export default function AiDoubts() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setAnswer("");

    if (!question.trim()) {
      setError("Please type your trading question before sending.");
      return;
    }

    setStatus("loading");

    try {
      const res = await baseAPI.post("/api/ai/ask", { question });
      setAnswer(res.data.payload.answer);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Unable to get a response from the AI assistant.");
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden transition-colors duration-300 max-w-3xl mx-auto">
      
      {/* Header Info Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-glass)] pb-6 mb-6">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Simulation Intelligence</span>
          <h1 className="text-2xl font-display font-black text-[hsl(var(--text-main))] leading-tight">Ask the AI Assistant</h1>
          <p className="text-xs text-[hsl(var(--text-muted))]">
            Solve strategy doubts and get quick guidance from the TradePro assistant.
          </p>
        </div>
        <div className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-4 py-2 text-xs font-black font-mono self-start sm:self-center">
          Model: Llama-3.3-Groq
        </div>
      </div>

      {/* Main Dialogue Box */}
      <div className="space-y-4">
        
        {/* If user hasn't gotten an answer yet, display a helper tip card */}
        {!answer && !error && (
          <div className="rounded-2xl border border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 p-5 text-center text-[hsl(var(--text-muted))] space-y-1 py-12">
            <span className="text-3xl block mb-2">💡</span>
            <p className="text-sm font-semibold text-[hsl(var(--text-main))]">Need strategy tips?</p>
            <p className="text-xs max-w-md mx-auto leading-relaxed">
              Ask about portfolio allocations, stop loss triggers, or how market sentiment factors influence virtual stock ticks risk-free.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400 text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Message bubble: AI Response */}
        {answer && (
          <div className="space-y-2 animate-fade-in">
            <span className="text-[9px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">AI Assistant response</span>
            <div className="rounded-2xl border border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/50 p-5 shadow-inner">
              <div className="mb-3.5 flex items-center gap-2 text-xs font-bold text-[hsl(var(--text-muted))]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/15">🤖</span>
                <span>TradePro Advisor</span>
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed text-[hsl(var(--text-main))] font-medium">{answer}</p>
            </div>
          </div>
        )}
      </div>

      {/* Message entry form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 border-t border-[var(--border-glass)] pt-6">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Your Question</label>
          <textarea
            rows={4}
            className="premium-input w-full px-4 py-3 rounded-2xl text-xs font-medium"
            placeholder="e.g. How can I balance stop-loss limits with take-profit thresholds for tech assets?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Thinking...
              </span>
            ) : "Ask Assistant"}
          </button>
          
          {status === "success" && (
            <p className="text-xs font-semibold text-emerald-400">Advisor response compiled successfully.</p>
          )}
        </div>
      </form>
    </div>
  );
}


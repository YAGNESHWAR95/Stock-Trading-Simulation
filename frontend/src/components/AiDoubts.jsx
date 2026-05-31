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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ask the AI Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ask your trading doubts and get quick guidance from the Stock-Trading-Platform assistant.
          </p>
        </div>
        <div className="rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          AI name: <span className="font-semibold">Stock-Trading-Platform</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Your question</label>
        <textarea
          rows={5}
          className="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-green-400 focus:ring-2 focus:ring-green-100"
          placeholder="Example: Should I add more tech stocks to my portfolio, or is the market too volatile right now?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {status === "loading" ? "Thinking..." : "Ask AI"}
          </button>
          {status === "success" && (
            <p className="text-sm text-green-600">AI response received successfully.</p>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {answer && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">🤖</span>
              AI resposta by Stock-Trading-Platform
            </div>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-900">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

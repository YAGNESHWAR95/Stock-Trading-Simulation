import exp from "express";

export const aiRoute = exp.Router();

// Public AI assistant endpoint (no auth required)
aiRoute.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ message: "Please ask a valid trading question." });
    }

    const apiName = process.env.AI_API_NAME || "Stock-Trading-Platform";
    const apiKey = process.env.AI_API_SECRET_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "AI service is not configured. Please contact admin." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful and highly knowledgeable virtual trading AI assistant. Provide concise, clear, and accurate answers to user questions about trading, stocks, crypto, markets, and investment strategies."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      throw new Error(errorData.error?.message || `Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response received from AI.";

    return res.status(200).json({ message: "AI response ready", payload: { apiName, answer } });
  } catch (err) {
    console.error("AI public endpoint error:", err);
    res.status(500).json({ message: "Failed to generate an AI response.", error: err.message });
  }
});

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

    const normalizedQuestion = question.toLowerCase();
    let answer = `AI assistant ${apiName} suggests: `;

    if (normalizedQuestion.includes("buy") || normalizedQuestion.includes("sell")) {
      answer += "Always check your current risk tolerance and avoid over-leveraging positions. ";
    }
    if (normalizedQuestion.includes("portfolio") || normalizedQuestion.includes("hold")) {
      answer += "Diversifying your holdings can improve stability during market swings. ";
    }
    if (normalizedQuestion.includes("market") || normalizedQuestion.includes("news")) {
      answer += "Use data-driven signals and avoid trading on emotion alone. ";
    }
    if (normalizedQuestion.includes("alert") || normalizedQuestion.includes("stop loss") || normalizedQuestion.includes("take profit")) {
      answer += "Set alerts and conditional orders so you can automate risk management. ";
    }
    if (answer === `AI assistant ${apiName} suggests: `) {
      answer += "I’m here to help with trading doubts. Ask me about orders, portfolio strategy, or market mechanics.";
    }

    return res.status(200).json({ message: "AI response ready", payload: { apiName, answer } });
  } catch (err) {
    console.error("AI public endpoint error:", err);
    res.status(500).json({ message: "Failed to generate an AI response.", error: err.message });
  }
});

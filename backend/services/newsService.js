import { AssetModel } from "../models/AssetModel.js";

const sentimentTemplates = {
  bullish: [
    "Investors are piling into %symbol% after goldilocks earnings and resilient guidance.",
    "%symbol% is catching a fresh wave of buying interest from traders.",
    "Momentum traders are calling %symbol% one of the best growth stories of the session."
  ],
  bearish: [
    "%symbol% looks vulnerable after sellers stepped in around the latest highs.",
    "Weak volume on %symbol% has traders bracing for a pullback.",
    "%symbol% is under pressure as profit-taking accelerates.",
  ],
  neutral: [
    "%symbol% is trading in a tight range as investors await market catalysts.",
    "Traders remain cautious on %symbol% ahead of the next data release.",
    "%symbol% is stabilizing after recent swings, with buyers and sellers evenly matched.",
  ],
};

const platformTags = [
  { platform: "Twitter", channel: "@TradeProLive" },
  { platform: "Reddit", channel: "r/MarketPulse" },
  { platform: "Twitter", channel: "@DailyEquity" },
  { platform: "Reddit", channel: "r/StockTalk" },
];

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildSentimentLabel(score) {
  if (score >= 0.35) return "Bullish";
  if (score <= -0.35) return "Bearish";
  return "Neutral";
}

function buildSentimentScore(feed) {
  if (!feed || feed.length === 0) return 0;
  return (
    feed.reduce((sum, item) => {
      if (item.sentiment === "bullish") return sum + 1;
      if (item.sentiment === "bearish") return sum - 1;
      return sum;
    }, 0) / feed.length
  );
}

export async function getMarketNewsFeed() {
  const assets = await AssetModel.find({ isActive: true }).sort({ currentPrice: -1 }).limit(8);

  const feed = assets.map((asset, index) => {
    const templateType = index % 3 === 0 ? "bullish" : index % 3 === 1 ? "bearish" : "neutral";
    const template = sample(sentimentTemplates[templateType]);
    const platform = platformTags[index % platformTags.length];

    return {
      id: `news-${asset._id}-${Date.now()}`,
      platform: platform.platform,
      author: platform.channel,
      handle: platform.channel,
      time: `${Math.floor(Math.random() * 12) + 1}m ago`,
      sentiment: templateType,
      headline: template.replace("%symbol%", asset.symbol),
      summary: `${asset.name} is trading at $${asset.currentPrice.toLocaleString()} with market cap ${asset.marketCap?.toLocaleString() || "N/A"}. Traders are watching the near-term setup closely.`,
      tags: [
        `#${asset.symbol}`,
        templateType === "bullish" ? "#Bullish" : templateType === "bearish" ? "#Bearish" : "#Neutral",
        index % 2 === 0 ? "#Earnings" : "#Macro",
      ],
    };
  });

  const score = buildSentimentScore(feed);
  const bullishCount = feed.filter((item) => item.sentiment === "bullish").length;
  const bearishCount = feed.filter((item) => item.sentiment === "bearish").length;
  const neutralCount = feed.filter((item) => item.sentiment === "neutral").length;

  return {
    feed,
    sentiment: {
      score,
      label: buildSentimentLabel(score),
      bullishCount,
      bearishCount,
      neutralCount,
      confidence: Math.round(((score + 1) / 2) * 100),
    },
  };
}

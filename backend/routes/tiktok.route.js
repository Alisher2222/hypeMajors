import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { username } = req.body;

  try {
    const runInput = { usernames: [username] };

    const response = await fetch(
      `https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(runInput),
      }
    );

    const data = await response.json();
    const posts = data[0]?.recentPosts?.slice(0, 10).reverse() || [];

    const chartData = posts.map((post) => ({
      date: new Date(post.createTime * 1000).toLocaleDateString("en-US"),
      likes: post.diggCount || 0,
    }));

    const totalLikes = chartData.reduce((sum, p) => sum + p.likes, 0);
    const avgLikes = Math.round(totalLikes / chartData.length);
    const bestPost = posts.reduce((top, post) =>
      post.diggCount > (top.diggCount || 0) ? post : top, {}
    );

    const trendDirection = chartData[chartData.length - 1].likes > chartData[0].likes
      ? "rising"
      : "falling";

    const analysis = {
      averageLikes: avgLikes,
      bestPostUrl: `https://www.tiktok.com/@${username}/video/${bestPost.id}`,
      bestPostLikes: bestPost.diggCount,
      trendSummary: `Engagement is ${trendDirection} over the last 10 posts.`,
    };

    res.json({ chartData, analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from Apify" });
  }
});

export default router;

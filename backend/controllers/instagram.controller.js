import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const analyzeInstagram = async (req, res) => {
  const { username } = req.body;

  try {
    const runInput = { usernames: [username] };

    const response = await axios.post(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`,
      runInput,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Using APIFY_TOKEN:", process.env.APIFY_TOKEN);

    const data = response.data;
    const posts = data[0]?.latestPosts?.slice(0, 10).reverse() || [];

    const chartData = posts.map((post) => {
      const timestamp = post.timestamp;
      const url = `https://www.instagram.com/p/${post.shortCode}`;
      console.log(`📅 Raw timestamp: ${timestamp} → ${new Date(timestamp)}`);
      console.log(`🔗 ${url}`);

      return {
        date: new Date(timestamp).toLocaleDateString("en-US"),
        likes: post.likesCount || 0,
      };
    });

    const totalLikes = chartData.reduce((sum, p) => sum + p.likes, 0);
    const avgLikes = Math.round(totalLikes / chartData.length);
    const bestPost = posts.reduce(
      (top, post) => (post.likesCount > (top.likesCount || 0) ? post : top),
      {}
    );

    const trendDirection =
      chartData[chartData.length - 1].likes > chartData[0].likes
        ? "rising"
        : "falling";

    const analysis = {
      averageLikes: avgLikes,
      bestPostUrl: `https://www.instagram.com/p/${bestPost.shortCode}`,
      bestPostLikes: bestPost.likesCount,
      trendSummary: `Engagement is ${trendDirection} over the last 10 posts.`,
    };

    res.json({ chartData, analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from Apify" });
  }
};

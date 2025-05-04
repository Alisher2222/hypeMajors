import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const analyzeTikTok = async (req, res) => {
  const { username } = req.body;
  console.log("📩 TikTok request body:", req.body);

  try {
    const runInput = { profiles: [username], resultsLimit: 10 };

    const response = await axios.post(
        `https://api.apify.com/v2/acts/clockworks~tiktok-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`,
        runInput,
        { headers: { "Content-Type": "application/json" } }
      );
      
      
      

    const data = response.data;
    const posts = data.slice(0, 10).reverse() || [];

    const chartData = posts.map((post) => {
      const url = post.webVideoUrl;
      console.log(`📅 ${new Date(post.createTime * 1000)} → 🔗 ${url}`);
      return {
        date: new Date(post.createTime * 1000).toLocaleDateString("en-US"),
        likes: post.diggCount || 0,
      };
    });

    res.json({ chartData });
  } catch (err) {
    console.error("❌ Apify TikTok fetch error:\n", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
};

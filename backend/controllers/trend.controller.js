import axios from "axios";

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";
const TIMEOUT = 120000; // 2 минуты

const buildPayload = (req) => {
  return {
    hashtag: req.body.instagramHashtag || req.body.hashtag || "coffee",
    industry: req.body.industry || "lifestyle",
    tone: req.body.brandTone || req.body.tone || "fun",
  };
};

export const getInstagramTrends = async (req, res) => {
  try {
    const payload = buildPayload(req);

    const response = await axios.post(
      `${FASTAPI_BASE_URL}/instagram`,
      payload,
      {
        timeout: TIMEOUT,
      }
    );

    res.status(200).json({ trends: response.data.data });
  } catch (err) {
    console.error("❌ Error fetching Instagram trends:", err.message);
    res.status(500).json({ error: "Failed to get Instagram trends" });
  }
};

export const getTiktokTrends = async (req, res) => {
  try {
    const payload = buildPayload(req);

    const response = await axios.post(`${FASTAPI_BASE_URL}/tiktok`, payload, {
      timeout: TIMEOUT,
    });

    res.status(200).json({ trends: response.data.data });
  } catch (err) {
    console.error("❌ Error fetching TikTok trends:", err.message);
    res.status(500).json({ error: "Failed to get TikTok trends" });
  }
};

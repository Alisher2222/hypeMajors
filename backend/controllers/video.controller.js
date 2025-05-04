import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";

// POST /instagram
export const getInstagramTrends = async (req, res) => {
  try {
    const { hashtag, industry, tone } = req.body;
    const response = await axios.post(`${FASTAPI_BASE_URL}/instagram`, {
      hashtag,
      industry,
      tone,
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Instagram Trends Error:", err.message);
    res.status(500).json({ error: "Failed to fetch Instagram trends" });
  }
};

// POST /tiktok
export const getTiktokTrends = async (req, res) => {
  try {
    const { hashtag, industry, tone } = req.body;
    const response = await axios.post(`${FASTAPI_BASE_URL}/tiktok`, {
      hashtag,
      industry,
      tone,
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error("TikTok Trends Error:", err.message);
    res.status(500).json({ error: "Failed to fetch TikTok trends" });
  }
};

// POST /generate-template
export const generateVideoTemplate = async (req, res) => {
  try {
    const { business_name, industry, target_audience, goal, tone, hashtag } =
      req.body;

    const response = await axios.post(`${FASTAPI_BASE_URL}/generate-template`, {
      business_name,
      industry,
      target_audience,
      goal,
      tone,
      hashtag,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Template Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate template" });
  }
};

// POST /generate-video
export const generateVideoFromTemplate = async (req, res) => {
  try {
    const { template_text } = req.body;

    const response = await axios.post(`${FASTAPI_BASE_URL}/generate-video`, {
      template_text,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Video Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate video" });
  }
};

// POST /generate-image-video
export const generateImageVideo = async (req, res) => {
  try {
    const { image_url, prompt } = req.body;

    const response = await axios.post(
      `${FASTAPI_BASE_URL}/generate-image-video`,
      {
        image_url,
        prompt,
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Image2Video Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate image-based video" });
  }
};

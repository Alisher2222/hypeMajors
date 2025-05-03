import schedule from "node-schedule";
import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sentTrends = new Set();
const scheduledJobs = new Map();

async function fetchTikTokTrends(hashtag) {
  try {
    const runInput = {
      searchQueries: [hashtag],
      numberOfPosts: 20,
    };

    const { data: items } = await axios.post(
      `https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      runInput,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const trends = [];

    for (const item of items) {
      const id = item.id;
      const desc = item.desc || item.text || "";
      const url = item.webVideoUrl || item.videoUrl || "";

      if (id && url && !sentTrends.has(id)) {
        trends.push({ desc, url });
        sentTrends.add(id);
      }

      if (trends.length >= 1) break;
    }

    return trends;
  } catch (error) {
    console.error("❌ Failed to fetch trends:", error.message);
    return [];
  }
}

async function sendEmail(trends, toEmail) {
  if (!trends.length) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  let content = "🔥 New TikTok Trends:\n\n";
  for (const trend of trends) {
    content += `🎬 ${trend.desc}\n🔗 ${trend.url}\n\n`;
  }

  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: toEmail,
    subject: "🔥 TikTok Trends Notification",
    text: content,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📬 Email sent to ${toEmail}`);
}

// ✅ Экспортируем функцию планирования
export const scheduleTrendNotifications = async (req, res) => {
  const { email, hashtag, interval } = req.body;

  if (!email || !hashtag || !interval) {
    return res
      .status(400)
      .json({ error: "email, hashtag, and interval are required" });
  }

  if (scheduledJobs.has(email)) {
    scheduledJobs.get(email).cancel();
  }

  const job = schedule.scheduleJob(`*/${interval} * * * *`, async () => {
    const trends = await fetchTikTokTrends(hashtag);
    await sendEmail(trends, email);
  });

  scheduledJobs.set(email, job);

  res.json({ message: `Scheduled emails to ${email} every ${interval} min` });
};

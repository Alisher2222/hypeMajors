import React, { useState } from "react";
import { Instagram } from "lucide-react";
import styles from "./ProgressPage.module.css";
import Navbar from "../../components/navbar/navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ========== Fetching Instagram Data ==========
async function fetchInstagramData(username, setChartData, setAnalysis, setError) {
  try {
    const response = await fetch("http://localhost:5000/api/instagram/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const { chartData, analysis } = await response.json();
    setChartData(chartData);
    setAnalysis(analysis);
  } catch (err) {
    console.error(err);
    setError("Failed to load Instagram data.");
  }
}
async function fetchTikTokData(username, setChartData, setError) {
  try {
    const response = await fetch("http://localhost:5000/api/tiktok/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }), // ✅ this must NOT be undefined
    });

    const { chartData } = await response.json();
    setChartData(chartData);
  } catch (err) {
    console.error(err);
    setError("Failed to load TikTok data.");
  }
}


// ========== Chart Component ==========
function InstagramChart({ username, data }) {
  if (!data.length) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Instagram Likes for @{username}</h3>
        <p>Based on the latest 10 posts</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="likes" stroke="#0d9488" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TikTokChart({ username, data }) {
  if (!Array.isArray(data) || data.length === 0) return null;


  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>TikTok Likes for @{username}</h3>
        <p>Based on the latest 10 videos</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="likes" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ========== Analysis Summary Card ==========
function AnalysisCard({ analysis }) {
  if (!analysis) return null;

  return (
    <div className={styles.card}>
      <h3 className={styles.cardHeader}>Trend Analysis</h3>
      <p>📊 Average Likes: <strong>{analysis.averageLikes}</strong></p>
      <p>🔥 Best Post: <a href={analysis.bestPostUrl} target="_blank" rel="noopener noreferrer">{analysis.bestPostUrl}</a> ({analysis.bestPostLikes} likes)</p>
      <p>📈 Trend Summary: {analysis.trendSummary}</p>
    </div>
  );
}

// ========== Main Analytics Component ==========
function InstagramAnalytics() {
  const [chartData, setChartData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!instagramUrl.startsWith("https://www.instagram.com/")) {
      setError("URL must begin with https://www.instagram.com/");
      return;
    }

    setIsAnalyzing(true);
    fetchInstagramData(
      instagramUrl.split("/").filter(Boolean).pop(),
      setChartData,
      setAnalysis,
      setError
    );
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowChart(true);
    }, 2000);
  };

  return (
    <div className={styles.analyticsWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>
            <Instagram className={styles.icon} /> Track your Instagram progress
          </h2>
          <p className={styles.description}>
            Enter your Instagram profile URL to analyze your growth and engagement metrics
          </p>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="https://www.instagram.com/yourusername"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className={styles.input}
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className={styles.button}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>

      {showChart && (
        <>
          <InstagramChart
            username={instagramUrl.split("/").filter(Boolean).pop() || ""}
            data={chartData}
          />
          <AnalysisCard analysis={analysis} />
        </>
      )}
    </div>
  );
}

function TikTokAnalytics() {
  const [tiktokUrl, setTikTokUrl] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!tiktokUrl.startsWith("https://www.tiktok.com/@")) {
      setError("URL must begin with https://www.tiktok.com/@");
      return;
    }
    console.log("TikTok username:", tiktokUrl.split("/").filter(Boolean).pop().replace("@", ""));

    setIsAnalyzing(true);
    fetchTikTokData(
      tiktokUrl.split("/").filter(Boolean).pop().replace("@", ""),
      setChartData,
      setError
    );

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowChart(true);
    }, 2000);
  };

  return (
    <div className={styles.analyticsWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>📱 TikTok Analyzer</h2>
          <p className={styles.description}>
            Enter TikTok profile URL to see the latest 10 video likes
          </p>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="https://www.tiktok.com/@username"
              value={tiktokUrl}
              onChange={(e) => setTikTokUrl(e.target.value)}
              className={styles.input}
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className={styles.button}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>

      {showChart && (
        <TikTokChart
          username={tiktokUrl.split("/").filter(Boolean).pop().replace("@", "")   || ""}
          data={chartData}
        />
      )}
    </div>
  );
}

// ========== Page Wrapper ==========
export default function ProgressPage() {
  return (
    <>
  <Navbar />
  <div className={styles.container}>
    <InstagramAnalytics />
    <TikTokAnalytics />
  </div>
</>

  );
}

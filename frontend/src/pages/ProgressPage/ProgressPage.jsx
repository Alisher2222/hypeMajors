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

// ====== Fetch Functions ======
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
      body: JSON.stringify({ username }),
    });

    const { chartData } = await response.json();
    setChartData(chartData);
  } catch (err) {
    console.error(err);
    setError("Failed to load TikTok data.");
  }
}

// ====== Chart Components ======
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

// ====== Instagram Analysis Summary ======
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

// ====== Instagram Analytics ======
function InstagramAnalytics() {
  const [username, setUsername] = useState("");
  const [chartData, setChartData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter an Instagram username");
      return;
    }

    setIsAnalyzing(true);
    fetchInstagramData(username.trim(), setChartData, setAnalysis, setError);
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
            Enter your Instagram username to analyze your growth and engagement metrics
          </p>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="yourusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <InstagramChart username={username} data={chartData} />
          <AnalysisCard analysis={analysis} />
        </>
      )}
    </div>
  );
}

// ====== TikTok Analytics ======
function TikTokAnalytics() {
  const [username, setUsername] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a TikTok username");
      return;
    }

    const cleanUsername = username.replace("@", "").trim();
    console.log("TikTok username:", cleanUsername);

    setIsAnalyzing(true);
    fetchTikTokData(cleanUsername, setChartData, setError);
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
            Enter your TikTok username to see the latest 10 video likes
          </p>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

      {showChart && <TikTokChart username={username} data={chartData} />}
    </div>
  );
}

// ====== Main Export ======
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

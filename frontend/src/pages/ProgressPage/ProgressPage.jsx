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

// ========== Компонент: InstagramChart ==========
const generateMockData = (days) => {
  const data = [];
  let followers = 1000 + Math.floor(Math.random() * 500);
  let engagement = 50 + Math.floor(Math.random() * 30);

  for (let i = 0; i < days; i++) {
    followers += Math.floor(Math.random() * 50) - 10;
    engagement += Math.floor(Math.random() * 10) - 4;
    data.push({
      day: `Day ${i + 1}`,
      followers,
      engagement,
      reach: Math.floor(followers * (1.5 + Math.random())),
      impressions: Math.floor(followers * (2.5 + Math.random())),
    });
  }

  return data;
};

const mockData = generateMockData(30);

function InstagramChart({ username }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Instagram Analytics for @{username}</h3>
        <p>Track your growth and engagement metrics over the last 30 days</p>
      </div>
      <div className={styles.tabs}>
        <button className={styles.tab}>Followers</button>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mockData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => v.replace("Day ", "")}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="followers"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ========== Компонент: InstagramAnalytics ==========
function InstagramAnalytics() {
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
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowChart(true);
    }, 1500);
  };

  return (
    <div className={styles.analyticsWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>
            <Instagram className={styles.icon} /> Track your Instagram progress
          </h2>
          <p className={styles.description}>
            Enter your Instagram profile URL to analyze your growth and
            engagement metrics
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
        <InstagramChart
          username={instagramUrl.split("/").filter(Boolean).pop() || ""}
        />
      )}
    </div>
  );
}

// ========== Компонент страницы ==========
export default function ProgressPage() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <InstagramAnalytics />
      </div>
    </>
  );
}

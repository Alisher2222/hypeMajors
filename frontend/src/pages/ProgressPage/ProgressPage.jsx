// ✅ Переписанный компонент ProgressPage с выносом стилей в отдельный CSS модуль

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { TrendingUp } from "lucide-react";
import styles from "./ProgressPage.module.css";

function InstagramChart({ username, data }) {
  if (!data || !data.length) return null;
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
            <XAxis dataKey="date" className={styles.axisText} />
            <YAxis className={styles.axisText} />
            <Tooltip />
            <Line type="monotone" dataKey="likes" stroke="#0D9488" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TikTokChart({ username, data }) {
  if (!data || !data.length) return null;
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
            <XAxis dataKey="date" className={styles.axisText} />
            <YAxis className={styles.axisText} />
            <Tooltip />
            <Line type="monotone" dataKey="likes" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AnalysisCard({ analysis }) {
  if (!analysis) return null;
  return (
    <div className={styles.card}>
      <div className={styles.trendHeader}>
        <TrendingUp className={styles.icon} />
        <h3>Trend Analysis</h3>
      </div>
      <p>
        📊 Average Likes: <strong>{analysis.averageLikes}</strong>
      </p>
      <p>
        🔥 Best Post:
        <a
          href={analysis.bestPostUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {analysis.bestPostUrl}
        </a>{" "}
        ({analysis.bestPostLikes} likes)
      </p>
      <p>📈 Trend Summary: {analysis.trendSummary}</p>
    </div>
  );
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [instagramUsername, setInstagramUsername] = useState("");
  const [tiktokUsername, setTikTokUsername] = useState("");
  const [igData, setIgData] = useState([]);
  const [igAnalysis, setIgAnalysis] = useState(null);
  const [ttData, setTtData] = useState([]);
  const [error, setError] = useState("");
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    async function fetchBusinessUsernames() {
      try {
        const res = await fetch(`http://localhost:5000/business/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        const business = data.business;
        const igUser = business.instagram_username?.trim();
        const ttUser = business.tiktok_username?.trim();

        setInstagramUsername(igUser);
        setTikTokUsername(ttUser);
        setError("");

        await fetchInstagramData(igUser);
        await fetchTikTokData(ttUser);
        setShowContinue(true);
      } catch (err) {
        console.error(err);
        setError("Could not load business data.");
      }
    }
    fetchBusinessUsernames();
  }, [user.id, navigate]);

  async function fetchInstagramData(username) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/instagram/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );
      const { chartData, analysis } = await response.json();
      setIgData(chartData);
      setIgAnalysis(analysis);
    } catch (err) {
      console.error(err);
      setError("Instagram fetch failed.");
    }
  }

  async function fetchTikTokData(username) {
    try {
      const response = await fetch("http://localhost:5000/api/tiktok/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const { chartData } = await response.json();
      setTtData(chartData);
    } catch (err) {
      console.error(err);
      setError("TikTok fetch failed.");
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Analyzing your accounts...</h2>
        {error && <div className={styles.error}>{error}</div>}
        <InstagramChart username={instagramUsername} data={igData} />
        <AnalysisCard analysis={igAnalysis} />
        <TikTokChart username={tiktokUsername} data={ttData} />
        {showContinue && (
          <div className={styles.buttonWrapper}>
            <button
              className={styles.button}
              onClick={() => navigate("/suggestionsPage")}
            >
              Continue to Suggestions →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

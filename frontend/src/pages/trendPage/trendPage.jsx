import { useParams, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Share2,
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import styles from "./TrendPage.module.css";

export default function TrendPage() {
  const { id } = useParams();
  const location = useLocation();
  const trend = location.state?.trend;

  if (!trend) return <div className={styles.notFound}>Trend not found</div>;

  const getTikTokEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const match = url.match(/video\/(\d+)/);
    return match ? `https://www.tiktok.com/embed/${match[1]}` : null;
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/suggestionsPage" className={styles.backLink}>
            <ArrowLeft size={20} className={styles.backIcon} />
            Back to Suggestions
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.cardWrapper}>
          <div className={styles.imageWrapper}>
            {trend.image ? (
              <div className={styles.videoWrapper}>
                <iframe
                  src={getTikTokEmbedUrl(trend.image)}
                  width="100%"
                  height="480"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className={styles.video}
                  title={trend.trend}
                ></iframe>
              </div>
            ) : (
              <img
                src={trend.image}
                alt={trend.trend}
                className={styles.trendImage}
              />
            )}

            <span
              className={`${styles.trendType} ${
                trend.type === "post"
                  ? styles.post
                  : trend.type === "video"
                  ? styles.video
                  : styles.tiktok
              }`}
            >
              {trend.type.charAt(0).toUpperCase() + trend.type.slice(1)}
            </span>
          </div>

          <div className={styles.trendContent}>
            <h1 className={styles.trendTitle}>{trend.trend}</h1>
            <div className={styles.hashtags}>
              {trend.hashtags.map((tag) => (
                <span key={tag} className={styles.hashtag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.infoRow}>
              <div>
                <Calendar size={18} /> Trending Now
              </div>
              <div>
                <ThumbsUp size={18} /> Engagement: {trend.engagement}
              </div>
              <div>
                <Clock size={18} /> Difficulty: {trend.difficulty}
              </div>
            </div>
            <p className={styles.fullDescription}>{trend.fullDescription}</p>

            <div className={styles.tabsWrapper}>
              <input type="radio" id="tab1" name="tab" defaultChecked />
              <input type="radio" id="tab2" name="tab" />
              <input type="radio" id="tab3" name="tab" />
              <input type="radio" id="tab4" name="tab" />

              <div className={styles.tabLabels}>
                <label htmlFor="tab1">Why It Works</label>
                <label htmlFor="tab2">Suggested Script</label>
                <label htmlFor="tab3">Visual Tips</label>
                <label htmlFor="tab4">Best Practices</label>
              </div>

              <div className={styles.tabContent}>
                <div className={styles.tabPanel}>{trend.whyItWorks}</div>
                <div className={styles.tabPanel}>{trend.suggestedScript}</div>
                <div className={styles.tabPanel}>{trend.visualTips}</div>
                <div className={styles.tabPanel}>
                  <ul>
                    {trend.bestPractices.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <button className={styles.saveButton}>
            <Bookmark size={18} /> Save Trend
          </button>
          <button className={styles.shareButton}>
            <Share2 size={18} /> Share
          </button>
        </div>

        <section className={styles.similarSection}>
          <h2>Similar Trends You Might Like</h2>
          <div className={styles.similarGrid}>
            <div className={styles.similarCardPlaceholder}>
              <p>Coming soon...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

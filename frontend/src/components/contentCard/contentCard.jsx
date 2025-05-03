import { Link } from "react-router-dom";
import { ChevronRight, Instagram } from "lucide-react";
import styles from "./contentCard.module.css";

// ✅ Добавь функцию для извлечения TikTok ID
function extractTikTokId(url = "") {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : "";
}

export default function ContentCard({ suggestions = [] }) {
  return (
    <div className={styles.grid}>
      {suggestions.map((s) => {
        const safeType = s?.type ?? "unknown";
        const displayType =
          typeof safeType === "string"
            ? safeType.charAt(0).toUpperCase() + safeType.slice(1)
            : "Unknown";

        return (
          <Link
            to={`/trendPage/${s.id}`}
            state={{ trend: s }}
            key={s.id}
            className={styles.cardLink}
          >
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                {safeType === "tiktok" && s?.image?.includes("tiktok.com") ? (
                  <iframe
                    src={`https://www.tiktok.com/embed/${extractTikTokId(
                      s.image
                    )}`}
                    className={styles.tiktokFrame}
                    title="TikTok Video"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <div className={styles.instagramIcon}>
                    <Instagram />
                  </div>
                )}
                <span
                  className={`${styles.badge} ${
                    safeType === "post"
                      ? styles.post
                      : safeType === "video"
                      ? styles.video
                      : styles.tiktok
                  }`}
                >
                  {displayType}
                </span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{s.trend}</h3>
                <div className={styles.hashtags}>
                  {(s.hashtags || []).map((tag) => (
                    <span key={tag} className={styles.hashtag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.description}>{s.fullDescription}</p>
                <div className={styles.metaRow}>
                  <div>
                    <div className={styles.metaLabel}>Engagement</div>
                    <div className={styles.metaValue}>{s.engagement}</div>
                  </div>
                  <div>
                    <div className={styles.metaLabel}>Difficulty</div>
                    <div className={styles.metaValue}>{s.difficulty}</div>
                  </div>
                  <button className={styles.viewMore}>
                    View More <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";
import ContentCard from "../../components/contentCard/contentCard";
import ContentFormatFilter from "../../components/contentFormatFilter/contentFormatFilter";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./suggestionsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInstagramTrends,
  fetchTiktokTrends,
} from "../../store/trend.slice";
import { fetchUserBusinesses } from "../../store/businessForm.slice";
import { StreakCounter } from "../../components/streakCounter/streakCounter";

export default function SuggestionsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasFailed, setHasFailed] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const {
    industry,
    instagramHashtag,
    brandTone,
    status: businessStatus,
  } = useSelector((state) => state.businessForm);

  const {
    data: instagramTrends,
    status: instaStatus,
    error: instaError,
  } = useSelector((state) => state.trends.instagram);

  const {
    data: tiktokTrends,
    status: tiktokStatus,
    error: tiktokError,
  } = useSelector((state) => state.trends.tiktok);

  useEffect(() => {
    if (
      businessStatus === "succeeded" &&
      industry &&
      instagramHashtag &&
      brandTone &&
      instaStatus === "idle"
    ) {
      dispatch(
        fetchInstagramTrends({
          hashtag: instagramHashtag,
          industry,
          tone: brandTone,
        })
      );
    }

    if (
      businessStatus === "succeeded" &&
      industry &&
      instagramHashtag &&
      brandTone &&
      tiktokStatus === "idle"
    ) {
      dispatch(
        fetchTiktokTrends({
          hashtag: instagramHashtag,
          industry,
          tone: brandTone,
        })
      );
    }
  }, [
    businessStatus,
    industry,
    instagramHashtag,
    brandTone,
    instaStatus,
    tiktokStatus,
    dispatch,
  ]);

  useEffect(() => {
    if (instaStatus === "failed" || tiktokStatus === "failed") {
      setHasFailed(true);
    }
  }, [instaStatus, tiktokStatus]);

  const combinedData = [...instagramTrends, ...tiktokTrends];

  const filteredData =
    activeFilter === "all"
      ? combinedData
      : combinedData.filter((item) => item.type === activeFilter);

  const handleRetry = () => {
    setHasFailed(false);
    dispatch(
      fetchInstagramTrends({
        hashtag: instagramHashtag,
        industry,
        tone: brandTone,
      })
    );
    dispatch(
      fetchTiktokTrends({
        hashtag: instagramHashtag,
        industry,
        tone: brandTone,
      })
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionCenter}>
            <h2 className={styles.title}>
              Create Engaging Content for Your Business
            </h2>
            <StreakCounter count={5} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Content Suggestions</h3>
              <ContentFormatFilter
                active={activeFilter}
                setActive={setActiveFilter}
              />
            </div>

            {(instaStatus === "loading" || tiktokStatus === "loading") && (
              <p>Loading content suggestions...</p>
            )}

            {(instaStatus === "failed" || tiktokStatus === "failed") && (
              <p style={{ color: "red" }}>
                Error: {instaError?.error || tiktokError?.error || "Unknown"}
              </p>
            )}

            {hasFailed && (
              <button className="secondaryButton" onClick={handleRetry}>
                Try Again
              </button>
            )}

            {filteredData.length > 0 ? (
              <ContentCard suggestions={filteredData} />
            ) : (
              <p>No content suggestions found yet.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import styles from "./VideoTemplateGenerator.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Play,
  RefreshCw,
  CheckCircle,
  Crown,
  Video,
  LayoutTemplateIcon as Template,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/videoComponenets/videoComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  generateVideoFromImage,
  generateVideoTemplate,
} from "../../store/video.slice";
import CircularProgress from "@mui/material/CircularProgress";
import { generateVideoFromTemplate } from "./../../store/video.slice";
import PhotoUploader from "../../components/photoUploader/photoUploader";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import Navbar from "./../../components/navbar/navbar";

export default function VideoTemplateGenerator() {
  const [templateStatus, setTemplateStatus] = useState("not_generated");
  const [videoGenerationsLeft, setVideoGenerationsLeft] = useState(2);
  const [hasGeneratedVideo, setHasGeneratedVideo] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();

  const { businessName, industry, targetAudience, marketingGoal, brandTone } =
    useSelector((state) => state.businessForm);

  const { templateText, loading } = useSelector((state) => state.video);

  const downloadVideo = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "generated-video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Failed to download video:", err);
    }
  };

  const generateTemplate = async () => {
    if (
      businessName &&
      industry &&
      targetAudience &&
      marketingGoal &&
      brandTone
    ) {
      try {
        await dispatch(
          generateVideoTemplate({
            business_name: businessName,
            industry,
            target_audience: targetAudience,
            goal: marketingGoal,
            tone: brandTone,
            hashtag: "pizza",
          })
        ).unwrap();
        setTemplateStatus("generated");
      } catch (error) {
        console.error("Template generation failed:", error);
      }
    }
  };

  const generateVideo = async () => {
    if (videoGenerationsLeft <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setHasGeneratedVideo(false);

    try {
      if (photo) {
        // Генерация видео по изображению и шаблону
        await dispatch(
          generateVideoFromImage({
            image_url: photo,
            prompt: templateText || "Visual ad based on uploaded image",
          })
        ).unwrap();
      } else {
        // Генерация видео по шаблону
        await dispatch(
          generateVideoFromTemplate({ template_text: templateText })
        ).unwrap();
      }

      setHasGeneratedVideo(true);
      setVideoGenerationsLeft((prev) => prev - 1);
    } catch (error) {
      console.error("❌ Video generation failed:", error);
      alert("Failed to generate video. Please try again.");
    }
  };

  const url = useSelector((state) => state.video.videoUrl);

  const regenerateVideo = async () => {
    const newCount = videoGenerationsLeft - 1;
    setVideoGenerationsLeft(newCount);

    if (newCount <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setHasGeneratedVideo(false);

      const result = await dispatch(
        generateVideoFromTemplate({ template_text: templateText })
      ).unwrap();

      setHasGeneratedVideo(true);
    } catch (error) {
      console.error("Video generation failed:", error);
    } finally {
    }
  };

  const getStatusBadgeText = () => {
    if (templateStatus === "not_generated") return "Template: Not Generated";
    if (templateStatus === "generated") return "Template: Ready to Confirm";
    if (templateStatus === "finalized") {
      return hasGeneratedVideo
        ? `Video: ${videoGenerationsLeft}/2 attempts left`
        : "Video: Not Generated";
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.title}>Content Creator</h2>
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎨 {getStatusBadgeText()}
              </motion.div>
            </div>

            <div className={styles.stepIndicator}>
              <div
                className={`${styles.stepLine} ${
                  templateStatus !== "not_generated" ? styles.active : ""
                }`}
              />
              <div className={styles.stepNumber}>1</div>
              <div
                className={`${styles.stepLine} ${
                  templateStatus === "finalized" ? styles.active : ""
                }`}
              />
              <div
                className={`${styles.stepNumber} ${
                  templateStatus === "finalized" ? "" : styles.inactive
                }`}
              >
                2
              </div>
              <div className={styles.stepLine} />
            </div>
            {templateStatus !== "finalized" && (
              <PhotoUploader
                setPhoto={async (file) => {
                  try {
                    const url = await uploadToCloudinary(file);
                    setPhoto(url);
                  } catch (e) {
                    console.error("Upload failed", e);
                    alert("Failed to upload image");
                  }
                }}
                photo={photo}
              />
            )}
            <div className={styles.templateBox}>
              {url ? (
                <video
                  controls
                  src={url}
                  className={styles.videoPlayer}
                  width="100%"
                  height="auto"
                />
              ) : (
                templateText.split("\n").map((line, idx) => (
                  <p key={idx} className={styles.templateLine}>
                    {line}
                  </p>
                ))
              )}
            </div>

            {!(templateStatus === "finalized") && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <button
                  className={styles.buttonPrimary}
                  disabled={loading}
                  onClick={generateTemplate}
                >
                  {loading ? (
                    <p>Template is generating...</p>
                  ) : templateText ? (
                    "Regenerate Template"
                  ) : (
                    "Generate Template"
                  )}
                </button>
                {templateText && (
                  <button
                    className={styles.buttonOutline}
                    onClick={() => {
                      setTemplateStatus("finalized");
                    }}
                  >
                    Choose this template
                  </button>
                )}
              </div>
            )}

            {templateStatus === "finalized" && (
              <div style={{ padding: "20px" }}>
                {!hasGeneratedVideo ? (
                  <button
                    className={styles.buttonPrimary}
                    onClick={generateVideo}
                    disabled={loading || videoGenerationsLeft <= 0}
                  >
                    {loading ? (
                      <>
                        <CircularProgress color="white" size={28} />
                      </>
                    ) : (
                      "Generate Video"
                    )}
                  </button>
                ) : (
                  <div
                    style={{
                      paddingTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <button
                      className={styles.buttonPrimary}
                      onClick={downloadVideo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "15px",
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4 inline" /> Use This
                      Video
                    </button>
                    <button
                      className={styles.buttonOutline}
                      onClick={regenerateVideo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "15px",
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4 inline" /> Regenerate
                      Video
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <motion.div
            className={styles.proTip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {templateStatus === "not_generated" &&
              "Pro tip: Choose a template that matches your content style"}
            {templateStatus === "generated" &&
              "Pro tip: You can regenerate the template as many times as you want"}
            {templateStatus === "finalized" &&
              !hasGeneratedVideo &&
              "Pro tip: Your video will be based on the template you selected"}
            {templateStatus === "finalized" &&
              hasGeneratedVideo &&
              "Pro tip: You can customize the video after generation"}
          </motion.div>
        </div>

        <AnimatePresence>
          {showUpgradeModal && (
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
              <DialogContent className={styles.upgradeModal}>
                <DialogHeader>
                  <DialogTitle className={styles.dialogTitle}>
                    <Crown className={styles.icon} /> Upgrade to Pro
                  </DialogTitle>
                  <DialogDescription>
                    Get unlimited video generations and access to premium
                    templates.
                  </DialogDescription>
                </DialogHeader>

                <div className={styles.benefitsBox}>
                  <h3 className={styles.benefitsTitle}>Pro Plan Benefits:</h3>
                  <ul className={styles.benefitsList}>
                    <li>
                      <CheckCircle className={styles.iconSmall} /> Unlimited
                      video generations
                    </li>
                    <li>
                      <CheckCircle className={styles.iconSmall} /> Access to
                      premium templates
                    </li>
                    <li>
                      <CheckCircle className={styles.iconSmall} /> Advanced
                      customization options
                    </li>
                  </ul>
                </div>

                <DialogFooter className={styles.footerButtons}>
                  <button className={styles.primaryButton}>
                    Upgrade to Pro
                  </button>
                  <button
                    variant="outline"
                    className={styles.secondaryButton}
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Maybe Later
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

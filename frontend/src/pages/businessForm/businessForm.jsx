import React, { useState } from "react";
import styles from "./BusinessForm.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./../../components/navbar/navbar";
import Footer from "./../../components/footer/footer";
import { useDispatch } from "react-redux";
import { submitBusinessForm } from "../../store/businessForm.slice";
const BusinessForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    instagramHashtag: "",
    targetAudience: "",
    marketingGoal: "",
    brandTone: "",
    instagramUsername: "",
    tiktokUsername: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.businessName ||
      !formData.industry ||
      !formData.instagramHashtag ||
      !formData.targetAudience ||
      !formData.marketingGoal ||
      !formData.brandTone
    ) {
      alert("Please fill in all fields.");
      return;
    }
    dispatch(submitBusinessForm(formData));
    navigate("/progressPage");
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Business Information</h1>
        <p className={styles.subtitle}>
          Tell us about your business to help us create personalized content for
          you.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="industry"
            placeholder="Enter your industry name"
            value={formData.industry}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="instagramHashtag"
            placeholder="Enter your hashtag"
            value={formData.instagramHashtag}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="targetAudience"
            placeholder="Enter your audience"
            value={formData.targetAudience}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="marketingGoal"
            placeholder="Enter your market goal"
            value={formData.marketingGoal}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="brandTone"
            placeholder="Enter your brand tone, e.g., fun, professional"
            value={formData.brandTone}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="instagramUsername"
            placeholder="Instagram username (without @)"
            value={formData.instagramUsername}
            onChange={handleChange}
            className={styles.input}
          />

          <input
            type="text"
            name="tiktokUsername"
            placeholder="TikTok username (without @)"
            value={formData.tiktokUsername}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="location"
            placeholder="Enter the location of your business"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
          />

          <button type="submit" className="mainButton">
            Continue
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default BusinessForm;

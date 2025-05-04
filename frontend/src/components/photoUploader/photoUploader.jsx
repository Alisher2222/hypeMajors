import React, { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import styles from "./photoUploader.module.css";

export default function PhotoUploader({ photo, setPhoto }) {
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h3 className={styles.label}>
          <ImageIcon className={styles.icon} />
          Add Photo (Optional)
        </h3>
        {photo && (
          <button onClick={removePhoto} className={styles.removeButton}>
            <X className={styles.removeIcon} />
            Remove
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        className={styles.hiddenInput}
      />

      {!photo ? (
        <button onClick={triggerFileInput} className={styles.uploadBox}>
          <Upload className={styles.uploadIcon} />
          <span className={styles.uploadText}>Click to upload an image</span>
        </button>
      ) : (
        <div className={styles.imagePreview}>
          <img src={photo} alt="Selected" className={styles.image} />
        </div>
      )}
    </div>
  );
}

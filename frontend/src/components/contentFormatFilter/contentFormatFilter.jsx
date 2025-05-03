import { Instagram, Music } from "lucide-react";
import styles from "./ContentFormatFilter.module.css";

export default function ContentFormatFilter({ active, setActive }) {
  const filters = [
    { id: "all", label: "All", icon: null },
    { id: "instagram", label: "instagram", icon: Instagram },
    { id: "tiktok", label: "TikTok", icon: Music },
  ];

  return (
    <div className={styles.wrapper}>
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`${styles.button} ${
            active === id ? styles.active : styles.inactive
          }`}
        >
          {Icon && <Icon className={styles.icon} />} {label}
        </button>
      ))}
    </div>
  );
}

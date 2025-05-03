import { Flame } from "lucide-react";
import styles from "./streakCounter.module.css";

export function StreakCounter({ count, className = "" }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Flame className={styles.icon} color="#ff4d4d" fill="#ffcc00" />
      <span>{count}</span>
      <span>streak</span>
    </div>
  );
}

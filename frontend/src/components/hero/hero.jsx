import styles from "./hero.module.css";
import { Link } from "react-router-dom";
import LandingPagePhoto from "../../assets/LandingPagePhoto.png";

export default function Hero() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Bring Your Business Online – With Ease</h1>
          <p>
            No experience? No problem. Our AI helps you create trendy content
            for Instagram and TikTok in seconds.
          </p>
          <div className={styles.heroButtons}>
            <Link className="mainButton" to="/register">
              Get Started →
            </Link>
            <a className="secondaryButton" href="#howitWorks">
              Learn More
            </a>
          </div>
        </div>
        <img src={LandingPagePhoto} alt="photo" className={styles.heroImage} />
      </section>
    </main>
  );
}

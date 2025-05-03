import styles from "./howItWorks.module.css";
import { Smartphone, Users, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
export default function HowItWorks() {
  const cards = [
    {
      icon: <Smartphone color="#0D9488" />,
      title: "Choose Your Business",
      description:
        "Tell us about your business type, whether it's a bakery, salon, boutique, or any local service.",
    },
    {
      icon: <Users color="#0D9488" />,
      title: "Pick Target Audience",
      description:
        "Select who you want to reach - local customers, specific age groups, or interest-based audiences.",
    },
    {
      icon: <Instagram color="#0D9488" />,
      title: "Get Content Ideas",
      description:
        "Our AI instantly generates trending content ideas tailored specifically for your business.",
    },
  ];

  return (
    <section className={styles.container} id="howitWorks">
      <h1>How It Works?</h1>
      <p>
        Creating engaging social media content for your business has never been
        easier. Just three simple steps:
      </p>
      <div className={styles.cards}>
        {cards.map((card, index) => (
          <section className={styles.card} key={index}>
            <div>{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </section>
        ))}
      </div>
      <Link className="mainButton" to="/">
        Create your first post
      </Link>
    </section>
  );
}

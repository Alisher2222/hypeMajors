"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Tag,
  Users,
  Target,
  MessageSquare,
  Building,
  AlarmClock,
} from "lucide-react";
import Navbar from "../../components/navbar/navbar";
import styles from "./profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { scheduleEmail } from "../../store/notification.slice";

export default function Profile() {
  const [interval, setInterval] = useState(0);
  const personal = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.businessForm);
  const notificationStatus = useSelector((state) => state.notification.status);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    personal: {
      name: "",
      surname: "",
      email: "",
      avatarUrl: "/placeholder.svg?height=100&width=100",
    },
    business: {
      businessName: "",
      industry: "",
      instagramHashtag: "",
      targetAudience: "",
      marketingGoal: "",
      brandTone: "",
    },
  });

  useEffect(() => {
    if (personal && business) {
      setUserData((prev) => ({
        personal: {
          name: personal.name || "",
          surname: personal.surname || "",
          email: personal.email || "",
          avatarUrl:
            personal.avatarUrl || "/placeholder.svg?height=100&width=100",
        },
        business: {
          businessName: business.businessName || "",
          industry: business.industry || "",
          instagramHashtag: business.instagramHashtag || "",
          targetAudience: business.targetAudience || "",
          marketingGoal: business.marketingGoal || "",
          brandTone: business.brandTone || "",
        },
      }));
    }
  }, [personal, business]);

  const handleSchedule = () => {
    dispatch(
      scheduleEmail({
        email: personal.email,
        hashtag: business.instagramHashtag,
        interval: parseInt(interval),
      })
    );
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <img
              src={userData.personal.avatarUrl}
              alt={`${userData.personal.name} ${userData.personal.surname}`}
              className={styles.avatar}
            />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {userData.personal.name} {userData.personal.surname}
            </h1>
            <p className={styles.businessName}>
              {userData.business.businessName}
            </p>
            <p className={styles.hashtag}>
              #{userData.business.instagramHashtag}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Personal Information</h2>
            </div>
            <hr className={styles.separator} />
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <User className={styles.icon} />
                <div>
                  <p className={styles.label}>First Name</p>
                  <p className={styles.value}>{userData.personal.name}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <User className={styles.icon} />
                <div>
                  <p className={styles.label}>Last Name</p>
                  <p className={styles.value}>{userData.personal.surname}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Mail className={styles.icon} />
                <div>
                  <p className={styles.label}>Email</p>
                  <p className={styles.value}>{userData.personal.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Business Information</h2>
            </div>
            <hr className={styles.separator} />
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <Building className={styles.icon} />
                <div>
                  <p className={styles.label}>Business Name</p>
                  <p className={styles.value}>
                    {userData.business.businessName}
                  </p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Briefcase className={styles.icon} />
                <div>
                  <p className={styles.label}>Industry</p>
                  <p className={styles.value}>{userData.business.industry}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Tag className={styles.icon} />
                <div>
                  <p className={styles.label}>Instagram Hashtag</p>
                  <p className={styles.value}>
                    #{userData.business.instagramHashtag}
                  </p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Users className={styles.icon} />
                <div>
                  <p className={styles.label}>Target Audience</p>
                  <p className={styles.value}>
                    {userData.business.targetAudience}
                  </p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <Target className={styles.icon} />
                <div>
                  <p className={styles.label}>Marketing Goal</p>
                  <p className={styles.value}>
                    {userData.business.marketingGoal}
                  </p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <MessageSquare className={styles.icon} />
                <div>
                  <p className={styles.label}>Brand Tone</p>
                  <p className={styles.value}>{userData.business.brandTone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Sending Interval</h2>
            </div>
            <hr className={styles.separator} />
            <div className={styles.row}>
              <AlarmClock size={48} color="#0d9488" />
              <input
                type="number"
                id="interval"
                placeholder="Minutes"
                className={styles.input}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
              />
              <button
                className={styles.secondaryButton}
                onClick={handleSchedule}
                disabled={notificationStatus === "loading"}
              >
                {notificationStatus === "loading" ? "Setting..." : "Set"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

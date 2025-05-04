import { ArrowLeft } from "lucide-react";
import styles from "./register.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/auth.slice";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!user.name || !user.surname || !user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(register(user));
    setTimeout(() => navigate("/businessForm"), 1000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <a href="/" className={styles.backLink}>
          <ArrowLeft className={styles.icon} />
          <span className={styles.backText}>Back to Home</span>
        </a>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Let's Get Your Business Growing!</h1>
            <p className={styles.subtitle}>
              Create your account to start creating content
            </p>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className={styles.input}
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="surname" className={styles.label}>
                Full Surname
              </label>
              <input
                type="text"
                id="surname"
                placeholder="Your Surname"
                className={styles.input}
                value={user.surname}
                onChange={(e) => setUser({ ...user, surname: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                className={styles.input}
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className={styles.input}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Create Account
            </button>
          </form>

          <div className={styles.signIn}>
            <p>
              Already have an account?{" "}
              <Link className={styles.link} to="/signIn">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 HypeMajor. All rights reserved.</p>
      </footer>
    </div>
  );
}

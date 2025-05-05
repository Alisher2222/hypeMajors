import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./SignIn.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../../store/auth.slice";
import { fetchUserBusinesses } from "../../store/businessForm.slice";

export default function SignIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.user?.id);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const result = await dispatch(login(user)).unwrap();
      const userId = result.user.id;

      setTimeout(() => {
        dispatch(fetchUserBusinesses({ userId }));
        navigate("/");
      }, 1000);
    } catch (err) {
      alert(err?.message || "Login failed");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className={styles.centerWrapper}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h1>Welcome Back!</h1>
            <p>Sign in to continue creating amazing content</p>
          </div>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className={styles.input}
                value={user.email}
                onChange={(event) =>
                  setUser({ ...user, email: event.target.value })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Link to="#" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={user.password}
                onChange={(event) =>
                  setUser({ ...user, password: event.target.value })
                }
              />
            </div>

            <button type="submit" className={styles.signInButton}>
              Sign In
            </button>
          </form>

          <div className={styles.footerText}>
            <p>
              Don't have an account?{" "}
              <Link to="/register" className={styles.registerLink}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 SocialSage. All rights reserved.</p>
      </footer>
    </div>
  );
}

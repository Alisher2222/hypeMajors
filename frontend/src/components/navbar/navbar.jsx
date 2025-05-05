import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth.slice";
import { store } from "../../store/store";
import { useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      store.dispatch({ type: "RESET_APP" });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className={styles.container}>
      <Link to="/" className="link">
        <h1 className={styles.logo}>HypeMajor</h1>
      </Link>

      <div
        className={styles.hamburger}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        &#9776;
      </div>

      <div className={`${styles.links} ${isMobileMenuOpen ? styles.show : ""}`}>
        <Link
          to="/suggestionsPage"
          className="link"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Suggestions
        </Link>
        {!token ? (
          <>
            <Link
              to="/signIn"
              className="link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className={`${styles.mainButton} link`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/videoGenerate" className="link">
              Generate Image
            </Link>
            <Link
              to="/progressPage"
              className="link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              to="/profile"
              className="link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <span
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="link"
            >
              Logout
            </span>
          </>
        )}
      </div>
    </nav>
  );
}

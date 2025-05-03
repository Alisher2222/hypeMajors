import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth.slice";
import { store } from "../../store/store";
import styles from "./navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

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
      <div className={styles.links}>
        <Link to="/suggestionsPage" className="link">
          Suggestions
        </Link>
        {!token ? (
          <>
            <Link to="/signIn" className="link">
              Sign in
            </Link>
            <Link to="/register" className="mainButton">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/progress" className="link">
              Progress
            </Link>
            <Link className="link" to="/profile">
              Profile
            </Link>
            <Link onClick={handleLogout} className="link">
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

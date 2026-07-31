import styles from "./App.module.css";
import { NavLink, Outlet } from "react-router";

export default function App() {
  const logoAsset = import.meta.glob("../assets/maverick-logo.png", {
    eager: true,
    import: "default",
    query: "?url",
  });

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className="page-container">
          <nav className={styles.nav}>
            <NavLink to="/" className={styles.logo}>
              <img className={styles.logoImage} src={logoAsset[Object.keys(logoAsset)[0]]} />
              <p className={styles.logoText}>MAVERICK LABS</p>
            </NavLink>
            {/* <div className={styles.links}>
              <NavLink to="/games">Games</NavLink>
            </div> */}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

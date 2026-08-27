import { Breadcrumbs } from "../shared/components/Breadcrumbs";
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
        <div>
          <nav className={styles.nav}>
            <NavLink to="/" className={styles.logo}>
              <img
                className={styles.logoImage}
                src={logoAsset[Object.keys(logoAsset)[0]]}
              />
              <p className={styles.logoText}>MAVERICK LABS</p>
            </NavLink>
          </nav>
          <Breadcrumbs />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.projectInfo}>
            <div className={styles.footerLinks}>
              <p className="helperText">MAVERICK LABS</p>
              <div>
                <NavLink to="/games" className="helperText">
                  Game Catalog ·
                </NavLink>
                <NavLink to="/#architecture" className="helperText">
                  {" "}
                  Architecture
                </NavLink>
                <NavLink
                  to="https://github.com/Danyaell/maverick-labs-fe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="helperText"
                >
                  {" "}
                  · GitHub
                </NavLink>
              </div>
            </div>
            <p className="helperText">Plan. Analyze. Conquer.</p>
          </div>
          <div>
            <p className="helperText">
              Built by Danyaell Martinez O &copy; {new Date().getFullYear()}{" "}
              Maverick Labs
            </p>
            <p className="helperText">
              Unofficial, non-commercial fan project. Mega Man and related
              properties belong to Capcom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

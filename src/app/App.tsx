import styles from "./App.module.css";
import { NavLink, Outlet } from "react-router";

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className="page-container">
          <nav className={styles.nav}>
            <NavLink to="/" className={styles.logo}>
              Maverick Labs
            </NavLink>
            <div className={styles.links}>
              <NavLink to="/games">Games</NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

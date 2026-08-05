import { Link, useMatches, type UIMatch } from "react-router";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface BreadcrumbHandle {
  breadcrumb?: (gameCode?: string) => BreadcrumbItem;
}

export function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches.flatMap((match: UIMatch) => {
    const handle = match.handle as BreadcrumbHandle | undefined;

    if (!handle?.breadcrumb) {
      return [];
    }

    return [handle.breadcrumb(match.params.gameCode)];
  });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrentPage = index === breadcrumbs.length - 1;

          return (
            <li key={breadcrumb.to} className={styles.item}>
              {isCurrentPage ? (
                <span aria-current="page">{breadcrumb.label}</span>
              ) : (
                <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

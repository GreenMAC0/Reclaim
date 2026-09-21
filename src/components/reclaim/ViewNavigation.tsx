import { Link } from "@tanstack/react-router";
import { Monitor, Smartphone, SlidersHorizontal, Sprout } from "lucide-react";

const views = [
  { to: "/", label: "Station", detail: "Drop off & watch art grow", icon: Monitor },
  { to: "/app", label: "Personal companion", detail: "Explore & track your progress", icon: Smartphone },
  { to: "/operator", label: "Operator dashboard", detail: "Manage the station", icon: SlidersHorizontal },
  { to: "/impact", label: "Community impact", detail: "See the local results", icon: Sprout },
] as const;

export function ViewNavigation() {
  return (
    <nav className="view-navigation" aria-label="Switch ReClaim view">
      <span className="view-navigation-label">Switch view</span>
      <div className="view-navigation-links">
        {views.map(({ to, label, detail, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }} className="view-navigation-link"
            activeProps={{ className: "view-navigation-active", "aria-current": "page" }}>
            <Icon aria-hidden="true" size={22} />
            <span className="view-navigation-copy"><strong>{label}</strong><small>{detail}</small></span><span className="view-navigation-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

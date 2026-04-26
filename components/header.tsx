import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <div className="shell-header page-wrapper">
      <div className="shell-header__brand">
        <Link className="brand-link" href="/">
          Settled on the Field
        </Link>
      </div>
      <div className="shell-header__actions">
        <nav aria-label="Primary" className="shell-header__nav">
          <ul className="nav-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/summit">Summit</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <div className="shell-header__utility">
          <Link className="public-button shell-header__cta" href="/register">
            Register Now
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <div className="shell-header page-wrapper">
      <div>
        <Link className="brand-link" href="/">
          Settled on the Field
        </Link>
      </div>
      <div className="shell-header__actions">
        <nav aria-label="Primary">
          <ul className="nav-list">
            <li>
              <Link href="/">Landing</Link>
            </li>
            <li>
              <Link href="/summit">Summit</Link>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}

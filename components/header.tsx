import Link from "next/link";

export function Header() {
  return (
    <div className="shell-header page-wrapper">
      <div>
        <Link className="brand-link" href="/">
          Settled on the Field
        </Link>
      </div>
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
    </div>
  );
}

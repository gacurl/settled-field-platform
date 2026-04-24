import Link from "next/link";

export function Footer() {
  return (
    <div className="shell-footer">
      <div className="page-wrapper shell-footer__inner">
        <div className="shell-footer__grid">
          <div className="shell-footer__brand">
            <h2 className="shell-footer__title">The Success Summit</h2>
            <p className="shell-footer__tagline">
              Find Your Direction. Keep Dominating.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="shell-footer__nav-title">Explore</p>
            <ul className="shell-footer__links">
              <li>
                <Link href="/summit">Summit</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </nav>

          <div className="shell-footer__meta">
            <p className="shell-footer__contact">More details coming soon</p>
            <p className="shell-footer__copyright">© Settled on the Field</p>
          </div>

          <div className="shell-footer__powered-by">
            <p className="shell-footer__powered-label">Powered by</p>
            <div className="shell-footer__powered-brand">
              <div className="shell-footer__logo-placeholder" />
              <span>CurlTech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

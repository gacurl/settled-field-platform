import Link from "next/link";

export function Footer() {
  return (
    <div className="shell-footer">
      <div className="page-wrapper shell-footer__inner">
        <div className="shell-footer__grid">
          <div className="shell-footer__brand">
            <h2 className="shell-footer__title">Settled on the Field</h2>
            <p className="shell-footer__tagline">
              A grounded summit experience for people finding direction and building
              what comes next.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="shell-footer__nav-title">Follow</p>
            <ul className="shell-footer__links">
              <li>
                <span>YouTube coming soon</span>
              </li>
              <li>
                <span>Spotify coming soon</span>
              </li>
              <li>
                <span>Instagram coming soon</span>
              </li>
            </ul>
          </nav>

          <div className="shell-footer__meta">
            <p className="shell-footer__nav-title">Connect</p>
            <ul className="shell-footer__links">
              <li>
                <Link href="/register">Register your interest</Link>
              </li>
              <li>
                <a href="mailto:hello@settledonthefield.com">hello@settledonthefield.com</a>
              </li>
            </ul>
            <p className="shell-footer__copyright">© Settled on the Field</p>
          </div>

          <div className="shell-footer__powered-by">
            <a
              href="https://gregcurl.dev"
              className="shell-footer__powered-link"
              target="_blank"
              rel="noreferrer"
              aria-label="Built by CurlTech LLC"
            >
              <span className="shell-footer__powered-label">Built by</span>
              <img
                src="/assets/logos/curltech-logo-gray.png"
                alt="CurlTech LLC"
                className="shell-footer__logo"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

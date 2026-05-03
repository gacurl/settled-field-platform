import Image from "next/image";
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
                <span>Contact details coming soon</span>
              </li>
            </ul>
            <p className="shell-footer__copyright">© Settled on the Field</p>
          </div>

          <p className="shell-footer__attribution">
            Built with care by{" "}
            <a href="https://gregcurl.dev" target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/logos/curltech-logo-gray.svg"
                alt="CurlTech"
                className="shell-footer__logo-inline"
                width={1218}
                height={367}
                loading="lazy"
                unoptimized
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

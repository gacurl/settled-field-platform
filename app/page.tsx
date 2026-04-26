import Link from "next/link";
// import Image from "next/image";

export default function HomePage() {
  return (
    <div className="public-page">
      <section className="public-section public-section--hero public-hero-stage">
        <div className="page-wrapper page-wrapper--hero">
          <div className="public-hero-poster">
            <img
              src="/assets/images/success-summit-hero.png"
              alt="Conference stage with panel discussion and audience"
              className="public-hero-poster__image"
            />

            <div className="public-hero-poster__overlay">
              <div className="public-hero-poster__content">
                <p className="public-section__eyebrow">The Success Summit</p>

                <h1 className="public-section__title">
                  Find Your Direction — Keep Dominating
                </h1>

                <p className="public-section__body public-section__body--spaced">
                  A focused experience for athletes and veterans navigating transition,
                  built on alignment, clarity, and execution.
                </p>

                <div className="public-actions">
                  <Link href="/summit" className="public-button">
                    View Summit
                  </Link>
                  <Link href="/register" className="public-link public-link--on-dark">
                    Register Interest
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--bordered public-section--trust">
        <p className="public-section__eyebrow">Why This Room Matters</p>
        <h2 className="public-section__heading">Built for real transition, not generic advice</h2>
        <div className="audience-grid audience-grid--full">
          <section className="audience-card">
            <h3>Who it is for</h3>
            <p>
              Athletes, veterans, and professionals carrying pressure, momentum,
              and a real next decision.
            </p>
          </section>
          <section className="audience-card">
            <h3>What they get</h3>
            <p>
              Clear perspective, practical direction, and a room shaped around
              execution instead of noise.
            </p>
          </section>
          <section className="audience-card">
            <h3>Why it is credible</h3>
            <p>
              The summit is structured around leadership, transition, and
              real-world application, not abstract motivation.
            </p>
          </section>
        </div>
        <div className="public-actions public-actions--trust">
          <Link className="public-button" href="/summit">
            View Summit
          </Link>
          <Link className="public-link" href="/register">
            Register Interest
          </Link>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Who It&apos;s For</p>
        <h2 className="public-section__heading">A focused room for people navigating what&apos;s next</h2>
        <div className="audience-grid audience-grid--full">
          <div className="audience-card">Student Veterans</div>
          <div className="audience-card">Veterans</div>
          <div className="audience-card">Student-Athletes</div>
          <div className="audience-card">Athletic Leaders</div>
          <div className="audience-card">Corporate Professionals</div>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Three Themes</p>
        <h2 className="public-section__heading">Focused on what moves people forward</h2>
        <div className="public-theme-grid">
          <section className="public-theme-card">
            <h3>Mental Success</h3>
            <p>
              Build the mindset, discipline, and resilience needed to lead well
              under pressure.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Transition Success</h3>
            <p>
              Navigate change with more clarity, better direction, and fewer
              avoidable missteps.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Actions for Success</h3>
            <p>
              Leave with practical moves you can apply in work, leadership, and
              life after the event.
            </p>
          </section>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">What You&apos;ll Gain</p>
        <h2 className="public-section__heading">Practical value you can act on</h2>
        <ul className="public-section__list">
          <li>leave with clearer direction</li>
          <li>turn pressure into practical next steps</li>
          <li>build stronger alignment for what comes next</li>
        </ul>
      </section>

      <section className="public-section public-section--bordered public-section--centered">
        <p className="public-section__eyebrow">Summit</p>
        <h2 className="public-section__heading">A clear view of the full experience</h2>
        <div className="public-section__copy">
          <p className="public-section__body">
            See how the summit is structured, what the themes cover, and how the
            experience is built to move people from reflection into action.
          </p>
        </div>
        <div className="public-actions">
          <Link className="public-link" href="/summit">
            Explore the Summit
          </Link>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Resources</p>
        <h2 className="public-section__heading">Practical takeaways, previewed simply</h2>
        <div className="public-theme-grid">
          <section className="public-theme-card">
            <h3>Decision frameworks</h3>
            <p>
              Learn practical ways to sort through competing priorities and make
              the next move with more confidence.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Leadership application</h3>
            <p>
              Take away ideas that apply to work, team settings, and transition
              moments beyond the event itself.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Momentum tools</h3>
            <p>
              Leave with simple next-step thinking you can use immediately instead
              of a heavy content library.
            </p>
          </section>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Partners</p>
        <h2 className="public-section__heading">Built to welcome credible support</h2>
        <div className="audience-grid audience-grid--full">
          <section className="audience-card">
            <h3>Logo-ready placement</h3>
            <p>
              Future partner marks and outbound links can live here without
              changing the page structure.
            </p>
          </section>
          <section className="audience-card">
            <h3>Mission-aligned support</h3>
            <p>
              This space is reserved for organizations that strengthen the summit&apos;s
              leadership, transition, and performance focus.
            </p>
          </section>
          <section className="audience-card">
            <h3>Placeholder-safe today</h3>
            <p>
              Partner details are intentionally lightweight for now so the page
              stays credible before sponsor data is finalized.
            </p>
          </section>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">Take the next step with intention</h2>
        <p className="public-section__body">
          Review the summit details, then register your interest.
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/summit">
            View Summit
          </Link>
          <Link className="public-link" href="/register">
            Register Interest
          </Link>
        </div>
      </section>
    </div>
  );
}

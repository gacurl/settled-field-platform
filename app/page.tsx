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

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Who It&apos;s For</p>
        <h2 className="public-section__heading">Built for people in transition</h2>
        <div className="public-section__copy">
          <p className="public-section__body">
            The summit is designed for people carrying responsibility,
            momentum, and a real next decision.
          </p>
        </div>
        <div className="audience-grid audience-grid--full">
          <div className="audience-card">Student Veterans</div>
          <div className="audience-card">Veterans</div>
          <div className="audience-card">Student-Athletes</div>
          <div className="audience-card">Athletic Leaders</div>
          <div className="audience-card">Corporate Professionals</div>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">What You&apos;ll Gain</p>
        <h2 className="public-section__heading">Practical value, not noise</h2>
        <ul className="public-section__list">
          <li>clarity in transition</li>
          <li>leadership perspective</li>
          <li>real-world strategies</li>
          <li>meaningful connections</li>
        </ul>
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
        <p className="public-section__eyebrow">Why It Matters</p>
        <h2 className="public-section__heading">Direction changes outcomes</h2>
        <p className="public-section__body public-section__body--wide">
          Transition is hard when identity, structure, and expectations are all
          shifting at once. People do not just need encouragement. They need
          perspective, strategy, and a clearer path forward.
        </p>
        <p className="public-section__body public-section__body--spaced public-section__body--wide">
          The Success Summit exists to fill that gap with grounded
          conversations, leadership insight, and a room built for what comes
          next.
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">Move toward what&apos;s next</h2>
        <p className="public-section__body">
          Explore the summit or register interest now.
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

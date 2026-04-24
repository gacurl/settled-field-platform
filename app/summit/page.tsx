import Link from "next/link";
import Image from "next/image";

export default function SummitPage() {
  return (
    <div className="public-page">
      <section className="public-section public-section--hero">
        <div className="public-hero page-wrapper--hero">
          <div className="public-hero__content">
            <h1 className="public-section__title">The Success Summit</h1>
            <p className="public-section__body">
              A leadership and transition summit for athletes, veterans, and
              professionals navigating what&apos;s next.
            </p>
            <div className="public-actions">
              <Link className="public-button" href="/register">
                Register Interest
              </Link>
              <Link className="public-link" href="/">
                View Landing
              </Link>
            </div>
          </div>

          <div className="public-hero__media">
            <div className="public-image-frame public-image-frame--hero">
              <Image
                alt="Summit overview visual with a three-day structure and partner-ready event framing."
                height="800"
                src="/success-summit-overview.svg"
                width="1600"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Event Overview</p>
        <h2 className="public-section__heading">A structured summit with real-world relevance</h2>
        <p className="public-section__body">
          The Success Summit brings together people navigating leadership,
          transition, and performance after major shifts in identity, career,
          and direction.
        </p>
        <p className="public-section__body public-section__body--spaced">
          It is built for athletes, veterans, university and athletic leaders,
          and professionals who want practical perspective, stronger alignment,
          and a credible room to connect in.
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Three Themes</p>
        <h2 className="public-section__heading">Focused on what drives forward motion</h2>
        <div className="public-theme-grid">
          <section className="public-theme-card">
            <h3>Mental Success</h3>
            <p>
              Strengthen mindset, resilience, and identity under pressure and
              change.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Transition Success</h3>
            <p>
              Clarify direction and align the next chapter with purpose,
              strengths, and opportunity.
            </p>
          </section>
          <section className="public-theme-card">
            <h3>Actions for Success</h3>
            <p>
              Turn insight into practical next moves across leadership, career,
              and life.
            </p>
          </section>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Program Structure</p>
        <h2 className="public-section__heading">Three days, three focused tracks</h2>
        <div className="public-theme-grid">
          <section className="public-theme-card">
            <h3>Day 1 — Mental + Identity</h3>
            <ul className="public-section__list">
              <li>Mindset, resilience, and personal leadership</li>
              <li>Identity shifts after sport, service, or role change</li>
            </ul>
          </section>
          <section className="public-theme-card">
            <h3>Day 2 — Transition + Alignment</h3>
            <ul className="public-section__list">
              <li>Career direction, alignment, and next-step clarity</li>
              <li>Leadership conversations across education, sport, and industry</li>
            </ul>
          </section>
          <section className="public-theme-card">
            <h3>Day 3 — Action + Execution</h3>
            <ul className="public-section__list">
              <li>Practical strategies for momentum after the summit</li>
              <li>Execution planning, accountability, and connection</li>
            </ul>
          </section>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Outcomes</p>
        <h2 className="public-section__heading">What the experience is built to deliver</h2>
        <ul className="public-section__list">
          <li>breakout sessions</li>
          <li>networking</li>
          <li>leadership development</li>
          <li>career alignment</li>
        </ul>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">Logistics</p>
        <h2 className="public-section__heading">Built for a credible live gathering</h2>
        <p className="public-section__body">
          Location: Indianapolis, IN
        </p>
        <p className="public-section__body public-section__body--spaced">
          Venue: TBD
        </p>
        <p className="public-section__body public-section__body--spaced">
          Final venue and schedule details will be released to registered
          attendees.
        </p>
        <p className="public-section__body public-section__body--spaced">
          The format is designed to support university, athletic, and
          leadership partnership opportunities without overextending the event
          promise.
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">For Partners & Sponsors</p>
        <h2 className="public-section__heading">A focused environment for meaningful connection</h2>
        <p className="public-section__body">
          The summit creates direct access to an audience shaped by leadership,
          performance, transition, and long-term growth.
        </p>
        <p className="public-section__body public-section__body--spaced">
          It offers a leadership-focused environment where sponsors and
          partners can connect with talent, build visibility, and participate
          in a credible conversation about what comes next.
        </p>
        <Link className="public-button" href="/register">
          Get Involved
        </Link>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">Be part of the summit conversation</h2>
        <p className="public-section__body">
          Register interest now and receive event updates as details are
          finalized.
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/register">
            Register Interest
          </Link>
          <Link className="public-link" href="/">
            View Landing
          </Link>
        </div>
      </section>
    </div>
  );
}

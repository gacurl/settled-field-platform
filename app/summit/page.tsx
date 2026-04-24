import Link from "next/link";

export default function SummitPage() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-section__title">
          Settled on the Field Summit
        </h1>
        <p className="public-section__body">
          A focused event for people navigating transition and looking for a
          clearer next move, grounded conversations, and practical direction.
        </p>
        <Link className="public-button" href="/register">
          Register Now
        </Link>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          Who It&apos;s For
        </h2>
        <ul className="public-section__list">
          <li>Athletes preparing for life beyond the current season</li>
          <li>Veterans navigating a new civilian chapter</li>
          <li>Transitioning professionals looking for renewed direction</li>
        </ul>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          What You&apos;ll Get
        </h2>
        <ul className="public-section__list">
          <li>Direction</li>
          <li>Clarity</li>
          <li>Connection</li>
          <li>Real conversations</li>
        </ul>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          Structure and Experience
        </h2>
        <p className="public-section__body">
          Expect focused talks, experienced speakers, room for interaction, and
          space to build meaningful connections with people facing similar
          questions about what comes next.
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          Ready to Join?
        </h2>
        <p className="public-section__body">
          Reserve your place and move into the next step with intention.
        </p>
        <Link className="public-link" href="/register">
          Register Now
        </Link>
      </section>
    </div>
  );
}

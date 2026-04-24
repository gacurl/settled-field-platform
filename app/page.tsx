import Link from "next/link";

export default function HomePage() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-section__title">
          Find Your Direction — Keep Dominating
        </h1>
        <p className="public-section__body">
          A calm, focused starting point for athletes and veterans ready to
          move into their next season with clarity, structure, and momentum.
        </p>
        <Link className="public-button" href="/summit">
          View Summit
        </Link>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          Purpose
        </h2>
        <p className="public-section__body">
          Transition can be disorienting for athletes and veterans when the
          structure that once defined everyday life starts to change. The
          platform exists to make that shift feel less uncertain by pointing
          people toward practical guidance, trusted voices, and a clearer next
          step.
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">
          Take the Next Step
        </h2>
        <p className="public-section__body">
          Explore the summit and see what direction looks like in action.
        </p>
        <Link className="public-link" href="/summit">
          View Summit
        </Link>
      </section>
    </div>
  );
}

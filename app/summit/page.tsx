import Link from "next/link";
import Image from "next/image";
import { logisticsContent } from "@/lib/content/logistics";
import { partnersContent } from "@/lib/content/partners";
import { summitContent } from "@/lib/content/summit";

export default function SummitPage() {
  return (
    <div className="public-page">
      <section className="public-section public-section--hero">
        <div className="public-hero page-wrapper--hero">
          <div className="public-hero__content">
            <h1 className="public-section__title">{summitContent.hero.title}</h1>
            <p className="public-section__body">
              {summitContent.hero.body}
            </p>
            <div className="public-actions">
              <Link className="public-button" href="/register">
                {summitContent.hero.primaryCta}
              </Link>
              <Link className="public-link" href="/">
                {summitContent.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="public-hero__media">
            <div className="public-image-frame public-image-frame--hero">
              <Image
                alt="Bill greeting and connecting in a leadership setting that reflects the summit's real-world tone."
                height="800"
                src="/assets/images/bill-navy-handshake.jpg"
                width="1600"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{summitContent.overview.eyebrow}</p>
        <h2 className="public-section__heading">{summitContent.overview.heading}</h2>
        <p className="public-section__body">
          {summitContent.overview.paragraphs[0]}
        </p>
        <p className="public-section__body public-section__body--spaced">
          {summitContent.overview.paragraphs[1]}
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{summitContent.speakerPerspective.eyebrow}</p>
        <h2 className="public-section__heading">{summitContent.speakerPerspective.heading}</h2>
        <div className="public-theme-grid">
          {summitContent.speakerPerspective.cards.map((card) => (
            <section className="public-theme-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{summitContent.themes.eyebrow}</p>
        <h2 className="public-section__heading">{summitContent.themes.heading}</h2>
        <div className="public-theme-grid">
          {summitContent.themes.cards.map((card) => (
            <section className="public-theme-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <div className="public-image-band">
          <div className="public-image-frame public-image-frame--band public-image-frame--triptych">
            <Image
              alt="Athletes preparing, aligning, and connecting across football, locker room, and track environments."
              height="1024"
              src="/assets/summit/summit-energy-triptych.png"
              width="1536"
            />
          </div>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{summitContent.programStructure.eyebrow}</p>
        <h2 className="public-section__heading">{summitContent.programStructure.heading}</h2>
        <div className="public-theme-grid">
          {summitContent.programStructure.cards.map((card) => (
            <section className="public-theme-card" key={card.title}>
              <h3>{card.title}</h3>
              <ul className="public-section__list">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{summitContent.outcomes.eyebrow}</p>
        <h2 className="public-section__heading">{summitContent.outcomes.heading}</h2>
        <ul className="public-section__list">
          {summitContent.outcomes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{partnersContent.summit.eyebrow}</p>
        <h2 className="public-section__heading">{partnersContent.summit.heading}</h2>
        <p className="public-section__body">
          {partnersContent.summit.paragraphs[0]}
        </p>
        <p className="public-section__body public-section__body--spaced">
          {partnersContent.summit.paragraphs[1]}
        </p>
        <Link className="public-button" href="/register">
          {partnersContent.summit.cta}
        </Link>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{logisticsContent.summit.eyebrow}</p>
        <h2 className="public-section__heading">{logisticsContent.summit.heading}</h2>
        <p className="public-section__body">
          {logisticsContent.summit.paragraphs[0]}
        </p>
        <p className="public-section__body public-section__body--spaced">
          {logisticsContent.summit.paragraphs[1]}
        </p>
        <p className="public-section__body public-section__body--spaced">
          {logisticsContent.summit.paragraphs[2]}
        </p>
        <p className="public-section__body public-section__body--spaced">
          {logisticsContent.summit.paragraphs[3]}
        </p>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">{summitContent.finalCta.heading}</h2>
        <p className="public-section__body">
          {summitContent.finalCta.body}
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/register">
            {summitContent.finalCta.primaryCta}
          </Link>
          <Link className="public-link" href="/">
            {summitContent.finalCta.secondaryCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

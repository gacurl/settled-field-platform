import Link from "next/link";
import Image from "next/image";
import { landingContent } from "@/lib/content/landing";
import { partnersContent } from "@/lib/content/partners";

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
                <p className="public-section__eyebrow">{landingContent.hero.eyebrow}</p>

                <h1 className="public-section__title">
                  {landingContent.hero.title}
                </h1>

                <p className="public-section__body public-section__body--spaced">
                  {landingContent.hero.body}
                </p>

                <div className="public-actions">
                  <Link href="/summit" className="public-button">
                    {landingContent.hero.primaryCta}
                  </Link>
                  <Link href="/register" className="public-link public-link--on-dark">
                    {landingContent.hero.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--bordered public-section--trust">
        <p className="public-section__eyebrow">{landingContent.trust.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.trust.heading}</h2>
        <div className="audience-grid audience-grid--full">
          {landingContent.trust.cards.map((card) => (
            <section className="audience-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
        <div className="public-actions public-actions--trust">
          <Link className="public-button" href="/summit">
            {landingContent.trust.primaryCta}
          </Link>
          <Link className="public-link" href="/register">
            {landingContent.trust.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">{partnersContent.landing.heading}</h2>
        <p className="public-section__body">{partnersContent.landing.subheading}</p>
        <div className="audience-grid audience-grid--full">
          {partnersContent.landing.partners.map((partner) => (
            <section className="audience-card" key={partner.name}>
              <h3>{partner.name}</h3>
              {partner.role ? <p>{partner.role}</p> : null}
              <p>{partner.description}</p>
            </section>
          ))}
        </div>
        <div className="public-actions">
          <Link className="public-link" href={partnersContent.landing.cta.href}>
            {partnersContent.landing.cta.label}
          </Link>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{landingContent.audience.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.audience.heading}</h2>
        <div className="audience-grid audience-grid--full">
          {landingContent.audience.items.map((item) => (
            <div className="audience-card" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{landingContent.themes.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.themes.heading}</h2>
        <div className="public-theme-grid">
          {landingContent.themes.cards.map((card) => (
            <section className="public-theme-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{landingContent.gains.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.gains.heading}</h2>
        <ul className="public-section__list">
          {landingContent.gains.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="public-section public-section--bordered public-section--centered">
        <p className="public-section__eyebrow">{landingContent.summitPreview.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.summitPreview.heading}</h2>
        <div className="public-section__copy">
          <p className="public-section__body">
            {landingContent.summitPreview.body}
          </p>
        </div>
        <div className="public-image-band">
          <div className="public-image-frame public-image-frame--band public-image-frame--editorial">
            <Image
              alt="Bill standing on a navy flight deck, reinforcing the summit's leadership and transition context."
              height="582"
              src="/assets/images/bill-navy-flight-deck.jpg"
              width="581"
            />
          </div>
        </div>
        <div className="public-actions">
          <Link className="public-link" href="/summit">
            {landingContent.summitPreview.cta}
          </Link>
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <p className="public-section__eyebrow">{landingContent.resources.eyebrow}</p>
        <h2 className="public-section__heading">{landingContent.resources.heading}</h2>
        <div className="public-theme-grid">
          {landingContent.resources.cards.map((card) => (
            <section className="public-theme-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="public-section public-section--bordered">
        <h2 className="public-section__heading">{landingContent.finalCta.heading}</h2>
        <p className="public-section__body">
          {landingContent.finalCta.body}
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/summit">
            {landingContent.finalCta.primaryCta}
          </Link>
          <Link className="public-link" href="/register">
            {landingContent.finalCta.secondaryCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

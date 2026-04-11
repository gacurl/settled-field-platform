export default function RegisterPage() {
  return (
    <section className="register-page">
      <div className="register-page__intro">
        <p className="register-page__eyebrow">Registration</p>
        <h1 className="register-page__title">
          Take your next step with intention.
        </h1>
        <p className="register-page__lede">
          Share a few details so we can hold your place and carry you into the
          payment step with clarity. This is a focused summit for people
          navigating transition and looking for practical direction.
        </p>
      </div>

      <div className="register-page__grid">
        <form className="register-card register-form">
          <div className="register-form__grid">
            <label className="register-field">
              <span>First name</span>
              <input autoComplete="given-name" name="firstName" type="text" />
            </label>

            <label className="register-field">
              <span>Last name</span>
              <input autoComplete="family-name" name="lastName" type="text" />
            </label>

            <label className="register-field register-field--full">
              <span>Email</span>
              <input autoComplete="email" name="email" type="email" />
            </label>

            <label className="register-field">
              <span>Phone</span>
              <input autoComplete="tel" name="phone" type="tel" />
            </label>

            <label className="register-field">
              <span>Organization / School / Team</span>
              <input name="organization" type="text" />
            </label>

            <label className="register-field register-field--full">
              <span>Role or affiliation</span>
              <input name="role" type="text" />
            </label>

            <label className="register-field register-field--full">
              <span>What are you hoping to get from the summit?</span>
              <textarea name="notes" rows={5} />
            </label>
          </div>

          <div className="register-cta">
            <div className="register-cta__content">
              <h2>Continue when you&apos;re ready</h2>
              <p>
                Payment is the next step. This page sets the expectation and
                gives attendees a clear place to commit before checkout is
                added.
              </p>
            </div>
            <button className="register-cta__button" type="button">
              Continue to Payment
            </button>
          </div>
        </form>

        <aside className="register-sidebar">
          <section className="register-card register-card--support register-panel">
            <h2>Summit snapshot</h2>
            <p>
              Settled on the Field is built for athletes, veterans, and
              professionals navigating a meaningful transition with more
              questions than certainty.
            </p>
            <ul>
              <li>Focused speakers and practical conversations</li>
              <li>Space to reflect, connect, and move forward</li>
              <li>A calm structure built around clarity, not noise</li>
            </ul>
          </section>

          <section className="register-card register-card--support register-panel">
            <h2>What happens next</h2>
            <ol>
              <li>Complete your registration details.</li>
              <li>Review the payment step.</li>
              <li>Receive confirmation once checkout is live.</li>
            </ol>
            <p className="register-panel__note">
              Questions or hesitation are normal. This step is here to make the
              path feel clear before payment is introduced.
            </p>
          </section>
        </aside>
      </div>
    </section>
  );
}

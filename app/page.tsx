import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h1
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "2.5rem",
            lineHeight: 1.1,
          }}
        >
          Find Your Direction — Keep Dominating
        </h1>
        <p
          style={{
            maxWidth: "40rem",
            margin: "0 0 var(--space-6)",
            color: "var(--color-accent)",
          }}
        >
          A calm, focused starting point for athletes and veterans ready to
          move into their next season with clarity, structure, and momentum.
        </p>
        <Link
          href="/summit"
          style={{
            display: "inline-block",
            padding: "var(--space-4) var(--space-6)",
            background: "var(--color-primary)",
            color: "var(--color-background)",
          }}
        >
          View Summit
        </Link>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          Purpose
        </h2>
        <p
          style={{
            maxWidth: "40rem",
            margin: "0",
            color: "var(--color-accent)",
          }}
        >
          Transition can be disorienting for athletes and veterans when the
          structure that once defined everyday life starts to change. The
          platform exists to make that shift feel less uncertain by pointing
          people toward practical guidance, trusted voices, and a clearer next
          step.
        </p>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          Take the Next Step
        </h2>
        <p
          style={{
            margin: "0 0 var(--space-6)",
            color: "var(--color-accent)",
          }}
        >
          Explore the summit and see what direction looks like in action.
        </p>
        <Link
          href="/summit"
          style={{
            display: "inline-block",
            padding: "var(--space-4) var(--space-6)",
            background: "var(--color-background)",
            color: "var(--color-primary)",
          }}
        >
          View Summit
        </Link>
      </section>
    </>
  );
}

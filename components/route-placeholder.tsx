type RoutePlaceholderProps = {
  title: string;
  path: string;
};

export function RoutePlaceholder({
  title,
  path,
}: RoutePlaceholderProps) {
  return (
    <section className="route-placeholder">
      <h1>{title}</h1>
      <p>Route: {path}</p>
    </section>
  );
}

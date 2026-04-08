type RoutePlaceholderProps = {
  title: string;
  path: string;
};

export function RoutePlaceholder({
  title,
  path,
}: RoutePlaceholderProps) {
  return (
    <main>
      <h1>{title} placeholder</h1>
      <p>Route: {path}</p>
    </main>
  );
}

type RoutePlaceholderProps = {
  title: string;
  path: string;
};

export function RoutePlaceholder({
  title,
  path,
}: RoutePlaceholderProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-16">
      <div className="w-full rounded-xl border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-semibold">{title} placeholder</h1>
        <p className="mt-3 text-sm text-black/60">Route: {path}</p>
      </div>
    </main>
  );
}

export default function TemplatePage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Template {params.id}</h1>
        <p className="text-muted-foreground">Template detail page</p>
      </div>
    </main>
  );
}

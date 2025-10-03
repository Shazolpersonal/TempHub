export default function EditTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Edit Template</h2>
      <p className="text-muted-foreground">
        Editing template {params.id}
      </p>
    </div>
  );
}

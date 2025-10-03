export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">{children}</main>
    </div>
  );
}

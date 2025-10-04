import { getAllTemplates } from '@/lib/templates';
import { AdminDashboardClient } from './admin-dashboard-client';

export default async function AdminDashboard() {
  // Fetch templates on server side
  const templates = await getAllTemplates();

  return <AdminDashboardClient initialTemplates={templates} />;
}

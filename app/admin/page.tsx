import { AdminDashboardClient } from './admin-dashboard-client';

export default function AdminDashboard() {
  // Templates are now fetched client-side with React Query for caching
  return <AdminDashboardClient />;
}

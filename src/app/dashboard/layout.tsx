// frontend/src/app/dashboard/layout.tsx
// Dashboard layout (header, sidebar)

import Header from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="py-6 sm:py-10">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
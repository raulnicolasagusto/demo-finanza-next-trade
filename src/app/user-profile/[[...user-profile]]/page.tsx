import { UserProfile } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Perfil de Usuario
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Administra tu cuenta de Demo Finanza
          </p>
        </div>
        <div className="flex justify-center">
          <UserProfile 
            appearance={{
              elements: {
                card: 'shadow-lg',
                navbar: 'hidden',
                navbarMobileMenuButton: 'hidden',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden'
              }
            }}
            routing="path"
            path="/user-profile"
          />
        </div>
      </div>
    </div>
  );
}
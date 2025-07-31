import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h1>
          <p className="mt-2 text-gray-600">
            Regístrate en Demo Finanza
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors',
                card: 'shadow-none border-0 p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldInput: 'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent',
                formFieldLabel: 'block text-sm font-medium text-gray-700 mb-1',
                footerActionLink: 'text-gray-600 hover:text-gray-800 underline',
                socialButtonsBlockButton: 'border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors',
                dividerLine: 'bg-gray-300',
                dividerText: 'text-gray-500 text-sm',
              }
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
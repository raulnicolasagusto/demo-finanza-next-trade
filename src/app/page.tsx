import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                💰 Demo Finanza
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Controla tus
            <span className="text-blue-600"> Finanzas </span>
            de manera inteligente
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Demo Finanza te ayuda a gestionar tus ingresos, gastos y ahorros de forma
            sencilla y segura. Toma el control de tu futuro financiero hoy mismo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="/sign-in"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>
          
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Análisis Inteligente</h3>
              <p className="text-gray-600">
                Obtén insights automáticos sobre tus patrones de gasto y ahorro.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-green-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Seguridad Total</h3>
              <p className="text-gray-600">
                Tus datos están protegidos con la mejor tecnología de seguridad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-purple-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-gray-600">
                Interfaz intuitiva diseñada para que gestiones tus finanzas sin complicaciones.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Balance */}
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total balance</span>
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold">$</span>
            </div>
          </div>
          <div className="text-2xl font-bold">$5240.21</div>
        </div>

        {/* Total Spending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total spending</span>
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">💳</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">$250.80</div>
        </div>

        {/* Total Saved */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total saved</span>
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">🏦</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">$550.25</div>
        </div>
      </div>

      {/* Working Capital Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Working Capital</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Gráfico de Capital de Trabajo (próximamente)</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transaction</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📱</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">iPhone 13 Pro MAX</p>
                <p className="text-sm text-gray-500">Mobile</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">€420.84</p>
              <p className="text-sm text-gray-500">14 Apr 2022</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
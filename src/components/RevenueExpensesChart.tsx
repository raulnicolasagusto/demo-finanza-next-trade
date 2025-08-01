'use client';

export default function RevenueExpensesChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Revenue and Expenses Over Time</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <select className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white">
            <option>This week</option>
            <option>This month</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Placeholder para el gráfico */}
        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
          This week: $720
        </div>
        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Gráfico de Ingresos y Gastos (placeholder)</p>
        </div>
      </div>
    </div>
  );
}
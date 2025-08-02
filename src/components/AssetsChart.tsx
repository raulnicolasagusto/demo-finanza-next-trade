'use client';

export default function AssetsChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Gastos por Categoria ultimos 30 dias</h2>
      </div>
      
      <div className="flex items-start">
        {/* Gráfico circular placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0">
              {/* Segmentos del gráfico circular */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F87171" strokeWidth="20" strokeDasharray="75 175" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#818CF8" strokeWidth="20" strokeDasharray="50 250" strokeDashoffset="-75" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#34D399" strokeWidth="20" strokeDasharray="25 275" strokeDashoffset="-125" />
              </svg>
            </div>
            <div className="z-10 text-center">
              <span className="block text-sm font-medium text-gray-500">Total</span>
              <span className="block text-xl font-bold text-gray-900">$293,200</span>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Gold</span>
              </div>
              <p className="text-lg font-bold text-gray-900">$15,700</p>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Stock</span>
              </div>
              <p className="text-lg font-bold text-gray-900">$22,500</p>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Warehouse</span>
              </div>
              <p className="text-lg font-bold text-gray-900">$120,000</p>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-700">Land</span>
              </div>
              <p className="text-lg font-bold text-gray-900">$135,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
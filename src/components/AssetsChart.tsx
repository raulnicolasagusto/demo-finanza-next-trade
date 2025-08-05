'use client';

export default function AssetsChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gastos por Categoria ultimos 30 dias</h2>
      </div>
      
      <div className="flex items-start">
        {/* Gráfico circular placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-40 h-40 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300">
            <div className="absolute inset-0">
              {/* Segmentos del gráfico circular */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F87171" strokeWidth="20" strokeDasharray="75 175" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#818CF8" strokeWidth="20" strokeDasharray="50 250" strokeDashoffset="-75" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#34D399" strokeWidth="20" strokeDasharray="25 275" strokeDashoffset="-125" />
              </svg>
            </div>
            <div className="z-10 text-center">
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">$293,200</span>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="ml-6 space-y-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Comida</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">$120,000</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Transporte</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">$80,000</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">Entretenimiento</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">$40,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
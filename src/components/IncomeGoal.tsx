'use client';

export default function IncomeGoal() {
  // Datos de ejemplo
  const currentIncome = 24050;
  const goalIncome = 39276;
  const progressPercentage = Math.round((currentIncome / goalIncome) * 100);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-lg font-bold">{progressPercentage}%</span>
            <h2 className="text-base font-medium">Income Goal</h2>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">${currentIncome.toLocaleString()}</span>
            <span className="text-gray-400 text-sm"> / ${goalIncome.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">Progress so far this month</p>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-purple-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
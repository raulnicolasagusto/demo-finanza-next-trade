'use client';

interface SummaryCardProps {
  title: string;
  amount: string;
  trend?: 'up' | 'down' | 'neutral';
  trendColor?: string;
}

export default function SummaryCard({ title, amount, trend = 'neutral', trendColor = '#4F46E5' }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <div className="h-8 w-16">
          {/* Placeholder para el mini gráfico */}
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <path 
              d={trend === 'up' ? 'M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,0' : 
                 trend === 'down' ? 'M0,0 L10,5 L20,2 L30,10 L40,8 L50,15 L60,12 L70,20 L80,18 L90,25 L100,30' : 
                 'M0,15 L10,14 L20,16 L30,13 L40,17 L50,15 L60,16 L70,14 L80,16 L90,15 L100,15'}
              fill="none"
              stroke={trendColor}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{amount}</div>
    </div>
  );
}
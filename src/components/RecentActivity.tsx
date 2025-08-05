'use client';

interface ActivityItem {
  id: string;
  platform: string;
  type: string;
  amount: string;
  isPositive: boolean;
  time: string;
}

export default function RecentActivity() {
  // Datos de ejemplo
  const activities: ActivityItem[] = [
    {
      id: '1',
      platform: 'Instagram',
      type: 'Depositing',
      amount: '+$523.10',
      isPositive: true,
      time: 'Today at 7:18am'
    },
    {
      id: '2',
      platform: 'Facebook',
      type: 'Advertising',
      amount: '-$600.00',
      isPositive: false,
      time: 'Today at 6:10am'
    },
    {
      id: '3',
      platform: 'Twitter',
      type: 'Business',
      amount: '+$1200.00',
      isPositive: true,
      time: 'Today at 5:00pm'
    },
    {
      id: '4',
      platform: 'Linkedin',
      type: 'Payment',
      amount: '+$190.00',
      isPositive: true,
      time: 'Today at 4:30pm'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View all</button>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4 transition-colors duration-300">
              {/* Placeholder para iconos de plataformas */}
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {activity.platform.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">{activity.platform}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{activity.type}</span>
                </div>
                <div className="text-right">
                  <span className={`block text-sm font-semibold ${
                    activity.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activity.amount}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
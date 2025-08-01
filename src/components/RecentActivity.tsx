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
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              {/* Placeholder para iconos de plataformas */}
              <span className="text-xs">{activity.platform.charAt(0)}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900">{activity.platform}</h3>
              <p className="text-sm text-gray-500">{activity.type}</p>
            </div>
            
            <div className="text-right">
              <p className={`text-base font-medium ${activity.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {activity.amount}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
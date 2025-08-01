'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

// Importar los componentes
import SummaryCard from '@/components/SummaryCard';
import RevenueExpensesChart from '@/components/RevenueExpensesChart';
import AssetsChart from '@/components/AssetsChart';
import RecentActivity from '@/components/RecentActivity';
import IncomeGoal from '@/components/IncomeGoal';

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <DashboardLayout>
      {/* Primera fila: Tarjetas de resumen e Ingresos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Tarjetas de resumen - ocupan 3/4 del ancho */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard 
            title="Total Balance" 
            amount="$3,450.00" 
            trend="up" 
            trendColor="#4F46E5"
          />
          <SummaryCard 
            title="Total Spending" 
            amount="$2,550.00" 
            trend="up" 
            trendColor="#F59E0B"
          />
          <SummaryCard 
            title="Total Saved" 
            amount="$4,509.00" 
            trend="up" 
            trendColor="#8B5CF6"
          />
        </div>
        
        {/* Progreso de ingresos - ocupa 1/4 del ancho */}
        <div className="lg:col-span-1">
          <IncomeGoal />
        </div>
      </div>
      
      {/* Segunda fila: Gráficos y Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico de ingresos/gastos - ocupa 7/12 del ancho */}
        <div className="lg:col-span-7">
          <RevenueExpensesChart />
        </div>
        
        {/* Gráfico de activos - ocupa 5/12 del ancho */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <AssetsChart />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
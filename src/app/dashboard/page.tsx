'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AddExpenseModal from '@/components/AddExpenseModal';
import ExpensesTable from '@/components/ExpensesTable';
import { CreditCard } from 'lucide-react';

interface ExpenseData {
  name: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    redirect('/sign-in');
  }

  const handleAddExpense = (expense: ExpenseData) => {
    setExpenses([...expenses, expense]);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of ExpensesTable
    console.log('Nuevo gasto agregado:', expense);
  };

  // Función para actualizar la tabla cuando se acepta/rechaza un gasto compartido
  const handleExpenseUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout onExpenseUpdate={handleExpenseUpdate}>
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
              <CreditCard className="w-4 h-4 text-white" />
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
            <select className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white">
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

      {/* Add Expense Button */}
      <div className="mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          Agregar Gasto
        </button>
      </div>

      {/* Expenses Table */}
      <ExpensesTable refreshTrigger={refreshTrigger} />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </DashboardLayout>
  );
}
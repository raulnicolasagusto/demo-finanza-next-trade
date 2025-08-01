'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AddExpenseModal from '@/components/AddExpenseModal';
import ExpensesTable from '@/components/ExpensesTable';

interface ExpenseData {
  name: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

export default function Transacciones() {
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
    setRefreshTrigger(prev => prev + 1);
    console.log('Nuevo gasto agregado:', expense);
  };

  const handleExpenseUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout onExpenseUpdate={handleExpenseUpdate}>
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
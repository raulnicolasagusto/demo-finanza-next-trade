'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Edit, Utensils, ShoppingCart, Truck, CreditCard, Gem, Banknote, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  expense_id: string;
  expense_name: string;
  expense_amount: string;
  expense_category: 'Comida' | 'Super Mercado' | 'Delivery';
  payment_method: 'Debito' | 'Credito' | 'Efectivo';
  createdAt: string;
}

interface ExpensesTableProps {
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50, 'all'] as const;
type ItemsPerPageOption = typeof ITEMS_PER_PAGE_OPTIONS[number];

export default function ExpensesTable({ refreshTrigger }: ExpensesTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(5);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/expenses');
      const result = await response.json();
      
      if (result.success) {
        setExpenses(result.data);
      } else {
        setError(result.message || 'Error al cargar los gastos');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Error de conexión al cargar los gastos');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when trigger changes
  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  // Filter expenses based on search term
  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return expenses;
    
    const searchLower = searchTerm.toLowerCase();
    return expenses.filter(expense => {
      const date = new Date(expense.createdAt).toLocaleDateString('es-ES');
      return (
        expense.expense_name.toLowerCase().includes(searchLower) ||
        (expense.expense_amount || '').toLowerCase().includes(searchLower) ||
        expense.expense_category.toLowerCase().includes(searchLower) ||
        expense.payment_method.toLowerCase().includes(searchLower) ||
        date.includes(searchLower)
      );
    });
  }, [expenses, searchTerm]);

  // Pagination logic
  const totalItems = filteredExpenses.length;
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(totalItems / (itemsPerPage as number));
  
  const paginatedExpenses = useMemo(() => {
    if (itemsPerPage === 'all') return filteredExpenses;
    
    const startIndex = (currentPage - 1) * (itemsPerPage as number);
    const endIndex = startIndex + (itemsPerPage as number);
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Comida': return <Utensils className="w-5 h-5" />;
      case 'Super Mercado': return <ShoppingCart className="w-5 h-5" />;
      case 'Delivery': return <Truck className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  // Get payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Debito': return <CreditCard className="w-5 h-5" />;
      case 'Credito': return <Gem className="w-5 h-5" />;
      case 'Efectivo': return <Banknote className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  // Función para eliminar gasto
  const handleDeleteExpense = async (expense_id: string, expense_name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el gasto "${expense_name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingExpenseId(expense_id);

    try {
      const response = await fetch(`/api/expenses?expense_id=${expense_id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Gasto eliminado exitosamente');
        // Actualizar la lista de gastos
        fetchExpenses();
      } else {
        toast.error(result.message || 'Error al eliminar el gasto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setDeletingExpenseId(null);
    }
  };

  // Función para editar gasto (placeholder)
  const handleEditExpense = (expense_id: string) => {
    toast.info('Función de editar próximamente disponible');
    console.log('Editar gasto:', expense_id);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando gastos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">❌ {error}</p>
            <button 
              onClick={fetchExpenses}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          
          {/* Items per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900 font-medium">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value) as ItemsPerPageOption)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Todos' : option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron gastos que coincidan con tu búsqueda' : 'No hay gastos registrados aún'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:text-blue-700 underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre del Gasto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Método de Pago</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => (
                  <tr key={expense.expense_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{expense.expense_name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-green-600">${expense.expense_amount}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(expense.expense_category)}
                        <span className="text-gray-700">{expense.expense_category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getPaymentIcon(expense.payment_method)}
                        <span className="text-gray-700">{expense.payment_method}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 text-sm">{formatDate(expense.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEditExpense(expense.expense_id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar gasto"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteExpense(expense.expense_id, expense.expense_name)}
                          disabled={deletingExpenseId === expense.expense_id}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar gasto"
                        >
                          {deletingExpenseId === expense.expense_id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-900 font-medium">
                Mostrando {((currentPage - 1) * (itemsPerPage as number)) + 1} a {Math.min(currentPage * (itemsPerPage as number), totalItems)} de {totalItems} gastos
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-900 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
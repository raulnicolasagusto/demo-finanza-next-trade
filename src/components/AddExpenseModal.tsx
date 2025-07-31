'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: ExpenseData) => void;
}

interface ExpenseData {
  name: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

const categories = ['Comida', 'Super Mercado', 'Delivery'];
const paymentMethods = ['Debito', 'Credito', 'Efectivo'];



export default function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseData>({
    name: '',
    amount: '',
    category: categories[0],
    paymentMethod: paymentMethods[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  // Estados para el formulario de compartir gasto
  const [isShared, setIsShared] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Función para formatear el monto con puntos
  const formatAmount = (value: string) => {
    // Remover todo excepto números y puntos
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Dividir en parte entera y decimal
    const parts = numericValue.split('.');
    
    // Limitar a máximo 2 decimales
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
    }
    
    // Reunir las partes
    return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setFormData({ ...formData, amount: formattedValue });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    toast.error('El nombre del gasto es requerido');
    return;
  }

  if (!formData.amount.trim()) {
    toast.error('El monto del gasto es requerido');
    return;
  }

  // Validación para gastos compartidos
  if (isShared && !recipientEmail.trim()) {
    toast.error('El email del destinatario es requerido para gastos compartidos');
    return;
  }

  setIsLoading(true);

  try {
    // Decidir endpoint y datos según si es compartido o no
    const endpoint = isShared ? '/api/shared-expenses/invite' : '/api/expenses';
    
    const requestBody = isShared ? {
      recipient_email: recipientEmail,
      expense_data: {
        expense_name: formData.name,
        expense_amount: formData.amount,
        expense_category: formData.category,
        payment_method: formData.paymentMethod
      }
    } : {
      expense_name: formData.name,
      expense_amount: formData.amount,
      expense_category: formData.category,
      payment_method: formData.paymentMethod,
      is_shared: false
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (result.success) {
      const successMessage = isShared 
        ? '¡Invitación de gasto compartido enviada exitosamente!' 
        : '¡Gasto agregado exitosamente!';
      toast.success(successMessage);
      
      onAdd(formData); // Actualizar la UI local
      setFormData({
        name: '',
        amount: '',
        category: categories[0],
        paymentMethod: paymentMethods[0]
      });
      setIsShared(false);
      setRecipientEmail('');
      onClose();
    } else {
      toast.error(result.message || 'Error al procesar el gasto');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión. Intenta nuevamente.');
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      category: categories[0],
      paymentMethod: paymentMethods[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Agregar nuevo gasto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del gasto */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del gasto
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Ingresa el nombre del gasto"
              required
            />
          </div>

          {/* Monto del gasto */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Monto del gasto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">$</span>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="0.00"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Usa punto para separar decimales (ej: 123.45)</p>
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Medio de pago */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Medio de pago
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Compartir este gasto */}
<div className="mb-4">
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={isShared}
      onChange={(e) => setIsShared(e.target.checked)}
      className="mr-2"
    />
    <span className="text-sm font-medium text-gray-700">
      Compartir este gasto
    </span>
  </label>
</div>

{isShared && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email del destinatario
    </label>
    <input
      type="email"
      value={recipientEmail}
      onChange={(e) => setRecipientEmail(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="ejemplo@email.com"
      required={isShared}
    />
  </div>
)}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
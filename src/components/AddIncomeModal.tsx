'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (income: IncomeData) => void;
}

interface IncomeData {
  amount: string;
  type: string;
  note: string;
}

const incomeTypes = ['Sueldo', 'Honorarios', 'Ventas', 'Rentas', 'Otros Ingresos'];

export default function AddIncomeModal({ isOpen, onClose, onAdd }: AddIncomeModalProps) {
  const [formData, setFormData] = useState<IncomeData>({
    amount: '',
    type: incomeTypes[0],
    note: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limitar a 150 caracteres
    if (value.length <= 150) {
      setFormData({ ...formData, note: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount.trim()) {
      toast.error('El monto del ingreso es requerido');
      return;
    }

    if (!formData.note.trim()) {
      toast.error('La observación es requerida');
      return;
    }

    // Validar que el monto sea un número válido
    const amountNumber = parseFloat(formData.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('El monto debe ser un número válido mayor a 0');
      return;
    }

    // Validar longitud de la observación
    if (formData.note.trim().length > 150) {
      toast.error('La observación no puede exceder 150 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income_amount: formData.amount,
          income_type: formData.type,
          income_note: formData.note
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('¡Ingreso agregado exitosamente!');
        
        onAdd(formData); // Actualizar la UI local
        setFormData({
          amount: '',
          type: incomeTypes[0],
          note: ''
        });
        onClose();
      } else {
        toast.error(result.message || 'Error al agregar el ingreso');
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
      amount: '',
      type: incomeTypes[0],
      note: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 transition-colors duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agregar nuevo ingreso</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Monto del ingreso */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto del ingreso
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium">$</span>
                  <input
                    type="text"
                    id="amount"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-colors duration-300"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Usa punto para separar decimales (ej: 123.45)</p>
              </div>

              {/* Tipo de ingreso */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de ingreso
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                >
                  {incomeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Observaciones */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observaciones
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({formData.note.length}/150)</span>
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleNoteChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 resize-none transition-colors duration-300"
                  placeholder="Ingresa observaciones sobre este ingreso..."
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Máximo 150 caracteres</p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Agregando...' : 'Agregar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
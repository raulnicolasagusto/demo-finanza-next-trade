'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface AddCreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardData: CreditCardData) => void;
}

interface CreditCardData {
  name: string;
  type: string;
}

const cardTypes = ['Visa', 'American Express', 'MasterCard', 'Otro'];

export default function AddCreditCardModal({ isOpen, onClose, onAdd }: AddCreditCardModalProps) {
  const [formData, setFormData] = useState<CreditCardData>({
    name: '',
    type: cardTypes[0]
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validación del nombre de la tarjeta
  const isNameValid = formData.name.trim().length > 0 && formData.name.length <= 30;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre de la tarjeta es requerido');
      return;
    }

    if (formData.name.length > 30) {
      toast.error('El nombre no puede exceder los 30 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Tarjeta de crédito agregada exitosamente!');
      
      onAdd(formData);
      setFormData({
        name: '',
        type: cardTypes[0]
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar la tarjeta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      type: cardTypes[0]
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agrega nueva tarjeta de crédito</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre de la tarjeta */}
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la tarjeta
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-colors duration-300 ${
                    !isNameValid && formData.name.length > 0 ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Tarjeta para gastos de super"
                  maxLength={30}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Máximo 30 caracteres
                  </p>
                  <p className={`text-xs ${
                    formData.name.length > 30 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formData.name.length}/30
                  </p>
                </div>
              </div>

              {/* Tipo de tarjeta */}
              <div>
                <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de tarjeta
                </label>
                <select
                  id="cardType"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                >
                  {cardTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
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
                  disabled={isLoading || !isNameValid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
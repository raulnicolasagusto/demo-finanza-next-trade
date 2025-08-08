import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  expense_id: string;
  user_id: string; // Clerk user ID
  expense_name: string;
  expense_amount: string;
  expense_category: 'Comida' | 'Super Mercado' | 'Delivery';
  payment_method: 'Debito' | 'Credito' | 'Efectivo';
  installment_quantity?: number; // Nuevo campo para cantidad de cuotas
  creditCard_id?: string; // Nuevo campo para identificar la tarjeta de crédito
  // Nuevos campos para gastos compartidos
  is_shared: boolean;
  shared_with_user_id?: string; // ID del usuario con quien se comparte
  shared_with_email?: string; // Email del usuario con quien se comparte
  original_creator_id?: string; // ID del creador original (para gastos aceptados)
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    expense_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    expense_name: {
      type: String,
      required: true,
      trim: true,
    },
    expense_amount: {
      type: String,
      required: true,
      trim: true,
    },
    expense_category: {
      type: String,
      required: true,
      enum: ['Comida', 'Super Mercado', 'Delivery'],
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['Debito', 'Credito', 'Efectivo'],
    },
    installment_quantity: {
      type: Number,
      min: 1,
      max: 48,
    },
    creditCard_id: {
      type: String,
      trim: true,
    },
    // Nuevos campos para gastos compartidos
    is_shared: {
      type: Boolean,
      default: false,
    },
    shared_with_user_id: {
      type: String,
    },
    shared_with_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    original_creator_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
ExpenseSchema.index({ expense_id: 1 });
ExpenseSchema.index({ user_id: 1 });
ExpenseSchema.index({ user_id: 1, createdAt: -1 }); // For user's expenses sorted by date

// Verificar si el modelo ya existe para evitar errores de re-compilación
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
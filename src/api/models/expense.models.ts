import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  expense_id: string;
  user_id: string; // Clerk user ID
  expense_name: string;
  expense_amount: string; // Nuevo campo para el monto del gasto
  expense_category: 'Comida' | 'Super Mercado' | 'Delivery';
  payment_method: 'Debito' | 'Credito' | 'Efectivo';
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better performance
ExpenseSchema.index({ expense_id: 1 });
ExpenseSchema.index({ user_id: 1 });
ExpenseSchema.index({ user_id: 1, createdAt: -1 }); // For user's expenses sorted by date

// FORZAR RECREACIÓN DEL MODELO
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
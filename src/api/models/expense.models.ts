import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  expense_id: string;
  user_id: string; // Clerk user ID
  expense_name: string;
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
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    expense_name: {
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

// Prevent model re-compilation during development
const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
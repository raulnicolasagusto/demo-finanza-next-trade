import mongoose, { Document, Schema } from 'mongoose';

export interface IIncome extends Document {
  income_id: string;
  user_id: string; // Clerk user ID
  income_amount: string;
  income_type: 'Sueldo' | 'Honorarios' | 'Ventas' | 'Rentas' | 'Otros Ingresos';
  income_note: string; // Máximo 150 caracteres
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema: Schema = new Schema(
  {
    income_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    income_amount: {
      type: String,
      required: true,
      trim: true,
    },
    income_type: {
      type: String,
      required: true,
      enum: ['Sueldo', 'Honorarios', 'Ventas', 'Rentas', 'Otros Ingresos'],
    },
    income_note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150, // Validación de máximo 150 caracteres
    },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

// Crear índices para mejor rendimiento
IncomeSchema.index({ income_id: 1 });
IncomeSchema.index({ user_id: 1 });
IncomeSchema.index({ user_id: 1, createdAt: -1 }); // Para ingresos del usuario ordenados por fecha

// Verificar si el modelo ya existe para evitar errores de re-compilación
if (mongoose.models.Income) {
  delete mongoose.models.Income;
}

const Income = mongoose.model<IIncome>('Income', IncomeSchema);

export default Income;
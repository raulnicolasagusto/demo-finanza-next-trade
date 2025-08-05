import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICreditCard extends Document {
  creditCard_id: string;
  user_id: string; // Clerk user ID
  card_name: string;
  card_type: 'Visa' | 'American Express' | 'MasterCard' | 'Otro';
  expense_amount_credit: string;
  payment_amount: string;
  createdAt: Date;
  updatedAt: Date;
}

const CreditCardSchema: Schema = new Schema(
  {
    creditCard_id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    user_id: {
      type: String,
      required: true,
    },
    card_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    card_type: {
      type: String,
      required: true,
      enum: ['Visa', 'American Express', 'MasterCard', 'Otro'],
    },
    expense_amount_credit: {
      type: String,
      default: '0',
      trim: true,
    },
    payment_amount: {
      type: String,
      default: '0',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar consultas
CreditCardSchema.index({ creditCard_id: 1 });
CreditCardSchema.index({ user_id: 1 });
CreditCardSchema.index({ user_id: 1, createdAt: -1 }); // Para tarjetas del usuario ordenadas por fecha

// Evitar re-compilación del modelo en desarrollo
if (mongoose.models.CreditCard) {
  delete mongoose.models.CreditCard;
}

const CreditCard = mongoose.model<ICreditCard>('CreditCard', CreditCardSchema);

export default CreditCard;
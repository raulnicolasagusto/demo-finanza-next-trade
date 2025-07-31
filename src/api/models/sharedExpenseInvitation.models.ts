import mongoose, { Document, Schema } from 'mongoose';

export interface ISharedExpenseInvitation extends Document {
  invitation_id: string;
  sender_email: string;
  recipient_email: string;
  expense_data: {
    expense_name: string;
    expense_amount: string;
    expense_category: 'Comida' | 'Super Mercado' | 'Delivery';
    payment_method: 'Debito' | 'Credito' | 'Efectivo';
  };
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: Date;
  accepted_at?: Date;
  declined_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SharedExpenseInvitationSchema: Schema = new Schema(
  {
    invitation_id: {
      type: String,
      required: true,
      unique: true,
    },
    sender_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    recipient_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expense_data: {
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
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
    accepted_at: {
      type: Date,
    },
    declined_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Crear índices para mejor rendimiento
SharedExpenseInvitationSchema.index({ invitation_id: 1 });
SharedExpenseInvitationSchema.index({ recipient_email: 1, status: 1 });
SharedExpenseInvitationSchema.index({ sender_email: 1 });
SharedExpenseInvitationSchema.index({ expires_at: 1 }); // Para limpiar invitaciones expiradas

// Verificar si el modelo ya existe para evitar errores de re-compilación
if (mongoose.models.SharedExpenseInvitation) {
  delete mongoose.models.SharedExpenseInvitation;
}

const SharedExpenseInvitation = mongoose.model<ISharedExpenseInvitation>(
  'SharedExpenseInvitation',
  SharedExpenseInvitationSchema
);

export default SharedExpenseInvitation;
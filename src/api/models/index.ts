// Export all models from a single file for easier imports
export { default as User } from './user.models';
export { default as Expense } from './expense.models';
export { default as SharedExpenseInvitation } from './sharedExpenseInvitation.models';
export { default as Income } from './income.models';
export { default as CreditCard, type ICreditCard } from './creditCard.models';

// Export interfaces
export type { IUser } from './user.models';
export type { IExpense } from './expense.models';
export type { ISharedExpenseInvitation } from './sharedExpenseInvitation.models';
export type { IIncome } from './income.models';


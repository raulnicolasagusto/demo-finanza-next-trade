// Export all models from a single file for easier imports
export { default as User } from './user.models';
export { default as Expense } from './expense.models';
export { default as SharedExpenseInvitation } from './sharedExpenseInvitation.models';

// Export interfaces
export type { IUser } from './user.models';
export type { IExpense } from './expense.models';
export type { ISharedExpenseInvitation } from './sharedExpenseInvitation.models';


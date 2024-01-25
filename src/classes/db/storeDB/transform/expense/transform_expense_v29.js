/**
 * @param {ExpenseType} expense
 * @return {ExpenseType}
 */
export function transform_expense_v29(expense) {
    expense.datetime = new Date(expense.datetime)
    expense.created_at = new Date(expense.created_at)
    return expense
}
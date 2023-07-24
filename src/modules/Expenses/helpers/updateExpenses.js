import constants from "../db/constants";
import toArray from "../../../utils/toArray";

export default async function updateExpenses(expensesModel, primary_entity_id) {
    if (expensesModel) {
        const expenses = await expensesModel.getFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_entity_id )
        return toArray(expenses)
    }
    return []
}
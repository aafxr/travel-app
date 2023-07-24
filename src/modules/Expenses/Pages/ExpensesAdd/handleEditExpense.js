import createActionMessage from "../../helpers/createActionMessage";
import {onUpdate} from "../../controllers/onUpdate";

export default function handleEditExpense(worker, model, isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum, expCurr, personal, section_id, navigate, expense) {
    if (expense && user_id) {
        if (
            expense.title !== expName
            || expense.value !== +expSum
            || expense.personal !== (personal ? 1 : 0)
            || expense.section_id !== section_id
            || expense.currency !== expCurr.code
        ) {

            const editedExpense = {
                ...expense,
                personal: personal ? 1 : 0,
                title: expName,
                value: +expSum,
                currency: expCurr.code,
                section_id
            }

            model.edit(editedExpense)
                .then(() => {
                    onUpdate(primary_entity_id,user_id)(model)
                    worker.postMessage(createActionMessage('edit', user_id, model, editedExpense))
                    navigate(-1)
                })

        }
    } else {
        console.warn('need add user_id & primary_entity_type')
    }
}
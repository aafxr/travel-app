import constants from "../../db/constants";

export default function handleEditExpense(controller, isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum, expCurr, personal, section_id, navigate, expense) {
    if (expense && user_id) {
        if (
            expense.title !== expName
            || expense.value !== +expSum
            || expense.personal !== (personal ? 1 : 0)
            || expense.section_id !== section_id
            || expense.currency !== expCurr.char_code
        ) {
            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            controller.write({
                storeName,
                action: 'edit',
                user_id,
                data: {
                    ...expense,
                    personal: personal ? 1 : 0,
                    title: expName,
                    value: +expSum,
                    currency: expCurr.char_code,
                    section_id
                }
            })

            navigate(-1)
        }
    } else {
        console.warn('need add user_id & primary_entity_type')
    }
}
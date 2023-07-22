import constants from "../../db/constants";
import createId from "../../../../utils/createId";

export default function handleAddExpense(controller, isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum,expCurr, personal, section_id, navigate) {
    if (user_id && primary_entity_type) {
        const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

        controller.write({
            storeName,
            action: 'add',
            user_id,
            data: {
                user_id,
                primary_entity_type: primary_entity_type,
                primary_entity_id,
                entity_type: '',
                entity_id: '',
                title: expName,
                value: Number(expSum),
                currency: expCurr.code,
                personal: personal ? 1 : 0,
                section_id,
                datetime: new Date().toISOString(),
                created_at: new Date().toISOString(),
                id: createId(user_id)
            }
        })


        navigate(-1)
    } else {
        console.warn('need add user_id & primary_entity_type')
    }
}
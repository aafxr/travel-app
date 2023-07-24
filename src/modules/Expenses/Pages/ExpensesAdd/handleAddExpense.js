import createId from "../../../../utils/createId";
import createActionMessage from "../../helpers/createActionMessage";
import {onUpdate} from "../../controllers/onUpdate";

export default function handleAddExpense(worker, model, isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum, expCurr, personal, section_id, navigate) {
    if (user_id && primary_entity_type) {
        const newExpense = {
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

        model.edit(newExpense)
            .then(() =>{
                onUpdate(primary_entity_id,user_id)(model)
                const data = createActionMessage('edit', user_id, model, newExpense)
                worker.postMessage(JSON.stringify(data))
        navigate(-1)
            })


    } else {
        console.warn('need add user_id & primary_entity_type')
    }
}
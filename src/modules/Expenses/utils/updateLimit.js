/**
 *
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} section_id
 */
import constants from "../db/constants";
import createId from "../../../utils/createId";

export default function updateLimit(controller, primary_entity_type, primary_entity_id, section_id, user_id, personal = false) {
    controller.read({
        storeName: constants.store.EXPENSES_PLAN,
        index: constants.indexes.SECTION_ID,
        query: IDBKeyRange.only(section_id)
    })
        .then(async (res) => {
                console.log(res)
                res = res ? Array.isArray(res) ? res : [res] : []

                const personalExp = []
                const commonExp = []

                res.forEach(e => {
                    e.personal && e.user_id === user_id && personalExp.push(e)
                    !e.personal && commonExp.push(e)
                })


                let limits = await controller.read({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.SECTION_ID,
                    query: IDBKeyRange.only(section_id)
                }) || []
                limits = Array.isArray(limits) ? limits : [limits]


                if (personal) {
                    const personalLimit = personalExp.reduce((acc, e) => e.value + acc, 0)
                    const personalLimitDB =
                        limits.find(l => l.personal === 1 && l.user_id === user_id)
                        || {
                            id: createId(user_id),
                            section_id, primary_entity_type, primary_entity_id, user_id,
                            personal: 1,
                            value: personalLimit
                        }

                    personalLimitDB.value < personalLimit && (personalLimitDB.value = personalLimit)

                    console.log('personalLimitDB ', personalLimitDB)
                    await controller.write({
                        storeName: constants.store.LIMIT,
                        action: 'edit',
                        user_id,
                        id: personalLimitDB.id,
                        data: personalLimitDB
                    })
                } else {
                    const commonLimit = commonExp.reduce((acc, e) => e.value + acc, 0)
                    const commonLimitDB =
                        limits.find(l => l.personal === 0)
                        || {
                            id: createId(),
                            section_id, primary_entity_type, primary_entity_id, user_id,
                            personal: 0,
                            value: commonLimit
                        }

                    commonLimitDB.value < commonLimit && (commonLimitDB.value = commonLimit)

                    console.log('commonLimitDB ', commonLimitDB)

                    await controller.write({
                        storeName: constants.store.LIMIT,
                        action: 'edit',
                        user_id,
                        id: commonLimitDB.id,
                        data: commonLimitDB
                    })
                }
            }
        )
}
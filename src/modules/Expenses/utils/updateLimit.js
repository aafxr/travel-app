/**
 *
 * @param {import('../../../controllers/ActionController').ActionController} controller
 * @param {string} section_id
 */
import constants from "../db/constants";
import createId from "../../../utils/createId";

export default function updateLimit(controller, section_id, user_id) {
    controller.read({
        storeName: constants.store.EXPENSES_PLAN,
        index: constants.indexes.SECTION_ID,
        query: IDBKeyRange.only(section_id)
    })
        .then(async (res) => {
                console.log(res)
                !res && (res = [])

                const personal = []
                const common = []

                res.forEach(e => {
                    e.personal && e.user_id === user_id && personal.push(e)
                    !e.personal && common.push(e)
                })

                const personalLimit = personal.reduce((acc, e) => e.value + acc, 0)
                const commonLimit = common.reduce((acc, e) => e.value + acc, 0)

                const limits = await controller.write({
                    storeName: constants.store.LIMIT,
                    index: constants.indexes.SECTION_ID,
                    query: IDBKeyRange.only(section_id)
                })

                const personalLimitDB =
                    limits.find(l => !!l.personal)
                    || {
                        id: createId(user_id),
                        section_id,
                        personal: 1,
                        value: personalLimit
                    }

                const commonLimitDB =
                    limits.find(l => !!l.personal)
                    || {
                        id: createId(),
                        section_id,
                        personal: 0,
                        value: commonLimit
                    }


            console.log(personalLimitDB)
            console.log(commonLimitDB)
                personalLimitDB.value < personalLimit && (personalLimitDB.value = personalLimit)
                commonLimitDB.value < commonLimit && (commonLimitDB.value = commonLimit)

                await controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    id: personalLimitDB.id,
                    data: personalLimitDB
                })

                await controller.write({
                    storeName: constants.store.LIMIT,
                    action: 'edit',
                    id: commonLimitDB.id,
                    data: commonLimitDB
                })
            }
        )
}
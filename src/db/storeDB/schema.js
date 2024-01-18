import constants from "../../static/constants";
import {transform_expense_v29} from "./transform/expense/transform_expense_v29";
import {transform_travel_v28} from "./transform/travel/transform_travel_v28";
import {transform_travel_v30} from "./transform/travel/transform_travel_v30";
import {transform_travel_v31} from "./transform/travel/transform_travel_v31";

/***
 * @description - описание структуры бд store
 * @type {DBSchemaType}
 */
const schema = {
    dbname: 'travelAppStore',
    version: 32,
    stores: [
        {
            name: constants.store.STORE,
            key: 'name',
            indexes: [],

        },
        {
            name: constants.store.CURRENCY,
            key: 'date',
            indexes: [],

        },
        {
            name: constants.store.IMAGES,
            key: 'id',
            indexes: [],
        },
        {
            name: constants.store.USERS,
            key: 'id',
            indexes: [],
        },
        //================ action =====================================================================================
        {
            name: constants.store.ACTION,
            key: 'id',
            indexes: ['synced', 'entity', 'action'],
        },
        //================ expenses ===================================================================================
        {
            name: constants.store.SECTION,
            key: 'id',
            indexes: [],
            upgrade: []
        },
        {
            name: constants.store.LIMIT,
            key: 'id',
            indexes: ['section_id', 'personal', constants.indexes.PRIMARY_ENTITY_ID, "user_id"],
        },
        {
            name: constants.store.EXPENSES_ACTUAL,
            key: 'id',
            indexes: ['user_id', constants.indexes.PRIMARY_ENTITY_ID, 'section_id'],
            upgrade: [
                {
                    version: 29,
                    transformCallback: transform_expense_v29,
                }
            ]
        },
        {
            name: constants.store.EXPENSES_PLAN,
            key: 'id',
            indexes: ['user_id', constants.indexes.PRIMARY_ENTITY_ID, 'section_id'],
            upgrade: [
                {
                    version: 29,
                    transformCallback: transform_expense_v29,
                }
            ]
        },
        //================ travels ===================================================================================
        {
            name: constants.store.TRAVEL,
            key: 'id',
            indexes: [],
            upgrade: [
                {
                    version: 28,
                    transformCallback: transform_travel_v28
                },
                {
                    version: 30,
                    transformCallback: transform_travel_v30
                },
                {
                    version: 31,
                    transformCallback: transform_travel_v31
                }
            ]
        },
        {
            name: constants.store.CHECKLIST,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID],
        },
        {
            name: constants.store.TRAVEL_WAYPOINTS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        {
            name: constants.store.UPDATE,
            key: 'primary_id',
            indexes: []
        },
        {
            name: constants.store.ROUTE,
            key: 'travel_id',
            indexes: []
        },
        //================ errors ===================================================================================
        {
            name: constants.store.ERRORS,
            key: 'time',
            indexes: []
        },
        //================ hotels ===================================================================================
        {
            name: constants.store.HOTELS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        //================ appointments =============================================================================
        {
            name: constants.store.APPOINTMENTS,
            key: 'id',
            indexes: [constants.indexes.PRIMARY_ENTITY_ID]
        },
        //================ updated Travel Info =======================================================================
        {
            name: constants.store.UPDATED_TRAVEL_INFO,
            key: constants.indexes.PRIMARY_ENTITY_ID,
            indexes: [constants.indexes.UPDATED_AT]
        }

    ],
};

export default schema;
const section = {
    id,
    hidden,
    title, 
    color,
}

const section_limit={
    id,
    section_id,
    personal,
    value
}


// фактические расходы
const item ={
    id,
    user_id,
    primary_entity_type,
    primary_entity_id,
    entity_type,
    entity_id,
    title,
    value,
    personal,
    section_id,
    datetime,
    created_at
}

const plan={
    id,
    user_id,
    primary_entity_type,
    primary_entity_id,
    entity_type,
    entity_id,
    title,
    value,
    personal,
    section_id,
    created_at
}

// localstorage
{
    limits,
    actual_expenses,
    planned_expneses,
    updated_at
}

const expensesActions = {
    id,
    uid,
    datetime,
    entity: {
        limit,
        expenses_actual,
        expenses_plan
    },
    action, // add, edit, remove
    data,
    synced
}


export class ExpansesManager{
    constructor(id, title, )
}
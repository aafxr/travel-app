const schema = {
    dbname: 'expenses',
    version: 1,
    stores:[
        {
            name:'section',
            key:'id',
            indexes: []
        },
        {
            name:'section_limit',
            key:'id',
            indexes: ['section_id','personal']
        },
        {
            name:'expanse_item',
            key:'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id']
        },
        {
            name:'plan',
            key:'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id']
        },

    ]
};

export default schema;
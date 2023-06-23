const schema = {
    dbname: 'expenses',
    version: 2,
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
            name:'expenses_actual',
            key:'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id']
        },
        {
            name:'expenses_planed',
            key:'id',
            indexes: ['user_id', 'primary_entity_id', 'section_id']
        },

    ]
};

export default schema;
/**
 * @description - описание структуры бд Expenses
 *
 *
 * dbname - имя бд
 *
 * version - версия
 *
 * stores - набор объектов описывающих storage в бд
 *
 */
const schema = {
  dbname: 'expenses',
  version: 5,
  stores: [
    {
      name: 'section',
      key: 'id',
      indexes: [],
    },
    {
      name: 'limit',
      key: 'id',
      indexes: ['section_id', 'personal','primary_entity_id'],
    },
    {
      name: 'expenses_actual',
      key: 'id',
      indexes: ['user_id', 'primary_entity_id', 'section_id'],
    },
    {
      name: 'expenses_plan',
      key: 'id',
      indexes: ['user_id', 'primary_entity_id', 'section_id'],
    },
    {
      name: 'expensesActions',
      key: 'id',
      indexes: ['synced', 'entity', 'action'],
    },
  ],
};

export default schema;

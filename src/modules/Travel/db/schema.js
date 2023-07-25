const schema = {
  dbname: 'routs',
  version: 1,
  stores: [
    {
      name: 'travel',
      key: 'id',
      indexes: [],
    },
    {
      name: 'travelActions',
      key: 'uid',
      indexes: ['synced', 'entity', 'action'],
    },
  ],
};

export default schema;

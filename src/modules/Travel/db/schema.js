import {GLOBAL_DB_VERSION} from "../../../static/constants";

const schema = {
  dbname: 'routs',
  version: 1 + GLOBAL_DB_VERSION,
  stores: [
    {
      name: 'travel',
      key: 'id',
      indexes: [],
    },
    {
      name: 'travelActions',
      key: 'id',
      indexes: ['synced', 'entity', 'action'],
    },
  ],
};

export default schema;

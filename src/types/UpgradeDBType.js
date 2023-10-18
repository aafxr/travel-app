/**
 * тип описывает как данные должны быть модифицированны при изменении версии бд
 * @name UpgradeDBType
 * @typedef {Object} UpgradeDBType
 * @property {number} version
 * @property {string[]} storeNames
 * @property {TransformFunction} transformCD
 */
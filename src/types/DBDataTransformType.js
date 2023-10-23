/**
 * @name DBDataTransformType
 * @typedef {Object} DBDataTransformType
 * @property {number} version версия БД для которой будет применятся callback "transformCallback" при событии  upgrade
 * @property {TransformCallback} transformCallback callback который будем модифицировать данные в бд при соьытии upgrade
 * @category Types
 */
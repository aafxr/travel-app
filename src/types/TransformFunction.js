/**
 * предпологается, что функция будет вызываться для конкретной версии бд и будет модифицировать данные в таблицах в бд
 * @name TransformFunction
 * @callback TransformFunction
 * @param {string} storeName имя хранилища, из которого TransformFunction получил данные
 * @param noModifiedItem запись из бд, которую предпологается обновить
 * @returns {*} модифицированные данные
 */
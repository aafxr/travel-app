/** @typedef {
 * | 'fetch'
 * | 'init'
 * | 'done'
 * | 'update-expenses-actual'
 * | 'update-expenses-planned'
 * | 'error'
 * } WMessageType
 */

/**
 *
 * @typedef WorkerMessageType
 * @property {WMessageType} type
 * @property payload
 */
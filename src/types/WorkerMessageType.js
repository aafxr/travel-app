/** @typedef {
 * | 'fetch'
 * | 'init'
 * | 'done'
 * | 'update-expenses-actual'
 * | 'update-expenses-planned'
 * | 'update-limit'
 * | 'error'
 * } WMessageType
 */

/**
 *
 * @typedef WorkerMessageType
 * @property {WMessageType} type
 * @property payload
 */
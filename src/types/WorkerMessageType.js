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
 * @template T
 * @property {WMessageType} type
 * @property {T} payload
 */
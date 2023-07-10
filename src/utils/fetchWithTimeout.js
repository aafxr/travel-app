/**
 * fetch  с возмодностью пррвать запрос указав timeout (по умолчанию 8000 мсек)
 * @param { RequestInfo | URL} resource
 * @param {RequestInit & Object.<'timeout', number>} options timeout = 8000 (default)
 * @returns {Promise<Response>}
 */
export default async function fetchWithTimeout(resource, options = {}) {
    const {timeout = 8000} = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}
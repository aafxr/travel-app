/**
 * возвращает имя браузера
 * @param {string} agent
 * @returns {string}
 */
export default function browserName(agent) {
    switch (true) {
        case /edge/i.test(agent):
            return "MS Edge";
        case /edg\//.test(agent):
            return "Edge ( chromium based)";
        case /opr/.test(agent) && !!window.opr:
            return "Opera";
        case /chrome/i.test(agent) && !!window.chrome:
            return "Chrome";
        case /trident/i.test(agent):
            return "MS IE";
        case /firefox/i.test(agent):
            return "Mozilla Firefox";
        case /safari/i.test(agent):
            return "Safari";
        default:
            return "other";
    }
}
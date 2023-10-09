/**
 * возвращает имя браузера
 * @function
 * @name browserName
 * @param {string} agent
 * @returns {string}
 * @category Utils
 */
export default function browserName(agent) {
    switch (true) {
        case /edge/i.test(agent):
            return "MS Edge";
        case /edg\//i.test(agent):
            return "Edge ( chromium based)";
        case /opr/.test(agent) && !!window.opr:
            return "Opera";
        case /chrome/i.test(agent) && !!window.chrome:
            return "Chrome";
        case /safari/i.test(agent):
            return "Safari";
        case /trident/i.test(agent):
            return "MS IE";
        case /firefox/i.test(agent):
            return "Mozilla Firefox";
        default:
            return "other";
    }
}
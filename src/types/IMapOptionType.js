/**
 * Тип описывает опции принимаемые интерфейсом IMap
 * для взаиводействия с картой
 * @name IMapOptionType
 * @typedef {Object} IMapOptionType
 * @property {string} suggestElementID id элемента к которому прикрепится блок с подсказками
 * @property {string} mapContainerID id элемента-контейнера карты
 * @property {WaypointType[]} placemarks массив точек которые будут добавленны в момент инициализации
 * @property {string} map instance возвращаемые api карт
 * @property {string} script
 * @property {string} markerClassName css-класс для стилезации маркера на карте
 * @property {string} iconURL URL картинки для маркера
 * @property {(p: WaypointType) => void} onPointUpdate Callback вызывается при обновлении информации о точке
 * @property {(p: WaypointType) => void} onPointClick Callback вызывается при клике на точке
 * @property {(p: WaypointType) => void} onPointAdd Callback вызывается при доьавлении новой точки
 * @category Types
 */
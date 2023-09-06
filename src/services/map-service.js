// class YMap{
//     constructor({
//                     containerId,
//                     api_key,
//
//     }) {
//         this._init(api_key)
//
//         this.api_key = api_key
//         this.containerId = containerId
//
//         this.script.onload = this
//     }
//
//     _init(api_key){
//         this.script = document.createElement('script')
//         this.script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=${api_key || ''}&load=Map,Placemark,search,geolocation,route,SuggestView,control.ZoomControl`
//         this.script.type = 'text/javascript'
//         document.body.append(this.script)
//     }
//
//     _cretateMap(){
//         window.ymap.Map()
//     }
// }
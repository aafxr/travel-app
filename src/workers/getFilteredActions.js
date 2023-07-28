import {actionsBlackList} from "../static/constants";

export default function getFilteredActions(data){
    const whiteList = []
    const blackList = []

    data.forEach(d => actionsBlackList.includes(d.entity) ?  blackList.push(d) : whiteList.push(d))

    return [whiteList, blackList]
}
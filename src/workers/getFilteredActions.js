import {actionsBlackList} from "../modules/Expenses/static/vars";

export default function getFilteredActions(data){
    const whiteList = []
    const blackList = []

    data.forEach(d => !actionsBlackList.includes(d.entity) ? whiteList.push(d) : blackList.push(d))

    return [whiteList, blackList]
}
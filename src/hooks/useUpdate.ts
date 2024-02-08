import {useState} from "react";

/**
 * хук, возвращает метод, который делает force-update
 * @returns {function(): void}
 */
export default function useUpdate(){
    const [_, update] = useState<object>()
    return () => update({})
}
import {useEffect} from "react";

/**
 *
 * @param {Worker} worker
 * @param {string} primary_entity_id
 */
export default function usePostMessage(worker, primary_entity_id){

    useEffect(()=>{
        /**
         * @param {KeyboardEvent} e
         */
        function handler(e){
            const {ctrlKey,shiftKey, key} = e
            if(ctrlKey && shiftKey && key === 'F9'){
                worker.postMessage({
                    type: 'fetch',
                    filter: {primary_entity_id}
                })
            }
        }

        if (worker){
            document.addEventListener('keyup', handler)
        }

        return ()=> document.removeEventListener('keyup', handler)
    }, [worker])
}
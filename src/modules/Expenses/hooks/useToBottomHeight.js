import {useEffect, useRef} from "react";

export default function useToBottomHeight(bottomMargin = 0){
    const ref = useRef()


    useEffect(()=>{
        if (ref && ref.current){
            //Element Height = Viewport height - element.offset.top - desired bottom margin
            ref.current.style.height = window.innerHeight - ref.current?.offsetTop - bottomMargin + 'px'
        }
    },[ref.current])

    return ref
}
import {useCallback, useEffect, useState} from "react";

export function useKeyPress(keyCodes = [], stopPropagation = false) {
    const [keys, setKeys] = useState(new Array(keyCodes.length).fill(null));

    const isCurrentKey = useCallback(function (e) {
        stopPropagation && e.stopPropagation();
        const newState = new Array(keyCodes.length).fill(null);

        if (keyCodes.includes(e.keyCode)) {
            const idx = keyCodes.indexOf(e.keyCode);
            if (idx > -1) {
                newState[idx] = keyCodes[idx];
            }
        }
        setKeys(newState);
    }, [])

    useEffect(() => {
        document.addEventListener("keydown", isCurrentKey);
        return () => {
            document.removeEventListener("keydown", isCurrentKey);
        };
    }, []);

    return keys;
}

import { useCallback, useEffect, useRef } from "react";

function useHotkey(callback: (e: KeyboardEvent) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function run(e: KeyboardEvent) {
      savedCallback.current(e);
    }
    window.addEventListener("keydown", run);
    return () => window.removeEventListener("keydown", run);
  }, []);
}

export default useHotkey;

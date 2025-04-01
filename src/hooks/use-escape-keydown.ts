import * as React from "react";
import { useCallbackRef } from "./use-callback-ref";

interface UseEscapeKeydownParams {
  document: Document;
  onEscapeKeyDown: (event: KeyboardEvent) => void;
  enabled?: boolean;
}

function useEscapeKeydown({
  document,
  onEscapeKeyDown,
  enabled,
}: UseEscapeKeydownParams) {
  const onEscapeKeyDownCallback = useCallbackRef(onEscapeKeyDown);

  React.useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscapeKeyDownCallback?.(event);
      }
    }
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", onKeyDown, {
        capture: true,
      });
  }, [enabled, onEscapeKeyDownCallback, document]);
}

export { useEscapeKeydown };

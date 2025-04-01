import { useEscapeKeydown } from "@/hooks/use-escape-keydown";
import * as React from "react";
import { useCallbackRef } from "./use-callback-ref";

const DATA_DISMISSABLE_LAYER_ATTR = "data-dice-dismissable-layer";
const DATA_DISMISSABLE_LAYER_STYLE_ATTR = "data-dice-dismissable-layer-style";

function getOwnerDocument(node: Node | null | undefined) {
  return node?.ownerDocument ?? globalThis.document;
}

interface FocusOutsideEvent {
  currentTarget: Node;
  target: Node;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

interface PointerDownOutsideEvent extends FocusOutsideEvent {
  detail: number;
}

interface UseDismissProps {
  /** Whether the dismissable layer is enabled. */
  enabled: boolean;

  /**
   * Callback called when the dismissable layer is dismissed.
   * @param event - The event that triggered the dismissal.
   */
  onDismiss: (
    event?: FocusOutsideEvent | KeyboardEvent,
  ) => void | Promise<void>;

  /** References to elements that should not trigger dismissal when clicked. */
  refs: React.RefObject<Element | null>[];

  /**
   * Event handler called when the escape key is pressed.
   * Can be prevented.
   *
   * @param event - The event that triggered the escape key press.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when the focus moves outside of the dismissable layer.
   * Can be prevented.
   *
   * @param event - The event that triggered the focus move outside.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction happens outside the dismissable layer.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   *
   * @param event - The event that triggered the interaction outside.
   */
  onInteractOutside?: (
    event: PointerDownOutsideEvent | FocusOutsideEvent,
  ) => void;

  /**
   * Event handler called when the a `pointerdown` event happens outside of the dismissable layer.
   * Can be prevented.
   *
   * @param event - The event that triggered the interaction outside.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Whether to disable hover/focus/click interactions on elements outside the dismissable layer.
   * Outside elements need to be clicked twice to interact with them: once to close the
   * dismissable layer, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;

  /**
   * Whether to prevent the dismissible layer from closing when scrolling on touch devices.
   * @default false
   */
  preventScrollDismiss?: boolean;

  /**
   * Delay in ms before adding event listeners.
   * @default 0
   */
  delayMs?: number;

  /**
   * Attribute to add to the dismissable layer.
   * @default DATA_DISMISSABLE_LAYER_ATTR
   */
  layerAttr?: string;

  /**
   * Attribute to add to the dismissable layer style.
   * @default DATA_DISMISSABLE_LAYER_STYLE_ATTR
   */
  layerStyleAttr?: string;
}

function useDismiss(params: UseDismissProps) {
  const {
    enabled,
    onDismiss,
    refs,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    disableOutsidePointerEvents = false,
    preventScrollDismiss = false,
    delayMs = 0,
    layerAttr = DATA_DISMISSABLE_LAYER_ATTR,
    layerStyleAttr = DATA_DISMISSABLE_LAYER_STYLE_ATTR,
  } = params;

  const ownerDocument = getOwnerDocument(refs[0]?.current);
  const isPointerInsideReactTreeRef = React.useRef(false);
  const onClickRef = React.useRef(() => {});

  useEscapeKeydown({
    document: ownerDocument,
    onEscapeKeyDown: (event) => {
      if (onEscapeKeyDown && !event.defaultPrevented) {
        onEscapeKeyDown(event);
        if (!event.defaultPrevented) {
          onDismiss(event);
        }
      }
    },
    enabled: enabled && !!onDismiss && !!onEscapeKeyDown,
  });

  const onPointerDownOutsideCallback = useCallbackRef(
    (event: PointerDownOutsideEvent) => {
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onDismiss(event);
      }
    },
  );

  const onFocusOutsideCallback = useCallbackRef((event: FocusOutsideEvent) => {
    onFocusOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) {
      onDismiss(event);
    }
  });

  React.useEffect(() => {
    if (!enabled) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element | null;
      if (!target || isPointerInsideReactTreeRef.current) return;

      const isInsideRefs = refs.some((ref) => ref.current?.contains(target));
      if (isInsideRefs) return;

      const outsideEvent: PointerDownOutsideEvent = {
        currentTarget: event.currentTarget as Node,
        target: target as Node,
        preventDefault: () => event.preventDefault(),
        defaultPrevented: event.defaultPrevented,
        detail: event.detail,
      };

      if (event.pointerType === "touch" && preventScrollDismiss) {
        if (!ownerDocument) return;
        ownerDocument.removeEventListener("click", onClickRef.current);
        onClickRef.current = () => onPointerDownOutsideCallback(outsideEvent);
        ownerDocument.addEventListener("click", onClickRef.current, {
          once: true,
        });
      } else {
        onPointerDownOutsideCallback(outsideEvent);
      }
    }

    function onFocusIn(event: FocusEvent) {
      const target = event.target as Element | null;
      if (!target) return;

      const isInsideRefs = refs.some((ref) => ref.current?.contains(target));
      if (isInsideRefs) return;

      const outsideEvent: FocusOutsideEvent = {
        currentTarget: event.currentTarget as Node,
        target: target as Node,
        preventDefault: () => event.preventDefault(),
        defaultPrevented: event.defaultPrevented,
      };

      onFocusOutsideCallback(outsideEvent);
    }

    if (disableOutsidePointerEvents) {
      const elements = refs.map((ref) => ref.current).filter(Boolean);
      for (const el of elements) {
        if (el) {
          el.setAttribute(layerAttr, "");
        }
      }

      const style = ownerDocument.createElement("style");
      style.setAttribute(layerStyleAttr, "");
      style.textContent = `[${layerAttr}] ~ *:not([${layerAttr}]) { pointer-events: none !important; }`;
      ownerDocument.head.appendChild(style);
    }

    const timeoutId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", onPointerDown);
      ownerDocument.addEventListener("focusin", onFocusIn);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      ownerDocument.removeEventListener("pointerdown", onPointerDown);
      ownerDocument.removeEventListener("focusin", onFocusIn);
      ownerDocument.removeEventListener("click", onClickRef.current);

      if (disableOutsidePointerEvents) {
        for (const ref of refs) {
          if (ref.current) {
            ref.current.removeAttribute(layerAttr);
          }
        }
        ownerDocument.querySelector(`[${layerStyleAttr}]`)?.remove();
      }
    };
  }, [
    enabled,
    refs,
    onPointerDownOutsideCallback,
    onFocusOutsideCallback,
    disableOutsidePointerEvents,
    preventScrollDismiss,
    delayMs,
    layerAttr,
    layerStyleAttr,
    ownerDocument,
  ]);

  return {
    onPointerDownCapture: () => {
      isPointerInsideReactTreeRef.current = true;
    },
    onPointerUpCapture: () => {
      window.setTimeout(() => {
        isPointerInsideReactTreeRef.current = false;
      }, 0);
    },
  };
}

export { useDismiss };

export type { FocusOutsideEvent, PointerDownOutsideEvent };

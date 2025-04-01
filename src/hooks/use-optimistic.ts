import * as React from "react";

export function useOptimistic<TData extends { id: string }>(data: TData[]) {
  const [optimisticData, setOptimisticData] = React.useOptimistic(
    data,
    (
      state,
      {
        action,
        item,
      }: {
        action: "add" | "delete" | "update";
        item: TData;
      },
    ) => {
      switch (action) {
        case "delete":
          return state.filter((i) => i.id !== item.id);
        case "update":
          return state.map((i) => (i.id === item.id ? item : i));
        default:
          return [...state, item];
      }
    },
  );

  return [optimisticData, setOptimisticData] as const;
}

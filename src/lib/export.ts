import type { Table } from "@tanstack/react-table";

export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;

    excludeColumns?: (keyof TData | "select" | "actions")[];
  } = {},
): void {
  const { filename = "table", excludeColumns = [] } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter(
      (id) =>
        !excludeColumns.includes(id as keyof TData | "select" | "actions"),
    );

  const csvContent = [
    headers.join(","),
    ...table.getRowModel().rows.map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          // Handle values that might contain commas or newlines
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

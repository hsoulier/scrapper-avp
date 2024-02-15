import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";
import data from "../../data/pathe.json";
import { PillVersion, PillWithTeam } from "./pill";

type Col = (typeof data)[number];

const columnHelper = createColumnHelper<Col>();
const columns = [
  // columnHelper.accessor("link", {}),
  // columnHelper.accessor("id", {
  //   header: "ID UGC",
  //   cell: (cell) => (
  //     <span className="text-xs text-neutral-600">{cell.renderValue()}</span>
  //   ),
  // }),
  // columnHelper.accessor("showing", {
  //   header: () => <div>ID Séance</div>,
  //   cell: (cell) => (
  //     <span className="text-xs text-neutral-600">{cell.renderValue()}</span>
  //   ),
  // }),
  columnHelper.accessor("showingType", {
    header: () => <div>Type</div>,
    cell: (cell) => <PillWithTeam infos={cell.renderValue() || ""} />,
  }),
  columnHelper.accessor("title", {
    header: () => <div>Nom</div>,
    cell: (cell) => (
      <span className="capitalize">{cell.renderValue()?.toLowerCase()}</span>
    ),
  }),
  // columnHelper.accessor("filmGender", {
  //   header: () => <div>Genre</div>,
  //   cell: (cell) => (
  //     <div className="flex flex-wrap gap-1">
  //       {cell
  //         .renderValue()
  //         ?.split(", ")
  //         .map((gender, index) => (
  //           <span
  //             key={index}
  //             className="text-xs text-neutral-600 bg-neutral-800 px-2 py-0.5 rounded-full"
  //           >
  //             {gender}
  //           </span>
  //         ))}
  //     </div>
  //   ),
  // }),
  columnHelper.accessor("cinema", {
    header: () => <div>Cinéma</div>,
    cell: (cell) => (
      <span className="text-xs text-neutral-600">{cell.renderValue()}</span>
    ),
  }),
  columnHelper.accessor("versions", {
    header: () => <div>Langue</div>,
    cell: (cell) => (
      <PillVersion version={cell.renderValue()?.[0]?.toUpperCase() || ""} />
    ),
  }),
  columnHelper.accessor("date", {
    header: () => <div>Séance</div>,
    cell: (cell) => {
      const value = cell.renderValue();
      if (!value) return null;
      const date = new Date(value);
      const displayedDate = date.toLocaleDateString("fr-FR", {
        weekday: "short",
        month: "2-digit",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      return <span className="text-xs text-neutral-600">{displayedDate}</span>;
    },
  }),
  // columnHelper.accessor("mediaLink", {
  //   header: () => <div>Page</div>,
  //   cell: (cell) => (
  //     <a
  //       className="inline-flex items-center gap-1 hover:underline underline-offset-2 text-sm"
  //       href={cell.renderValue() || ""}
  //     >
  //       <LinkIcon className="size-3" />
  //       <span className="text-sm font-medium">Lien</span>
  //     </a>
  //   ),
  // }),
];

const TablePathe = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "schedule", desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  console.log(sorting);

  return (
    <table className="table-auto w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none text-xl py-4 px-2 inline-flex items-center gap-1"
                          : "text-xl py-4 px-2 inline-flex items-center gap-1",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className="p-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TablePathe;

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table"
import { useState } from "react"
import { PillVersion, PillWithTeam } from "./pill"
import { LinkIcon } from "@heroicons/react/24/outline"

type Cols = {
  name: string
  showId: string | number
  movieId: string | number
  cinemaName: string
  dateShow: string
  linkMovie: string
  linkShow: string
  version: string
  earlyType: string
  source: string
}

const columnHelper = createColumnHelper<Cols>()
const columns = [
  columnHelper.accessor("showId", {
    header: () => <div>ID Séance</div>,
    cell: (cell) => <span className="text-xs text-neutral-600">{cell.renderValue()}</span>
  }),
  columnHelper.accessor("earlyType", {
    header: () => <div>Type</div>,
    cell: (cell) => <PillWithTeam infos={cell.renderValue() || ""} />
  }),
  columnHelper.accessor("name", {
    header: () => <div>Nom</div>,
    cell: (cell) => <span className="capitalize">{cell.renderValue()?.toLowerCase()}</span>
  }),
  columnHelper.accessor("cinemaName", {
    header: () => <div>Cinéma</div>,
    cell: (cell) => <span className="text-xs text-neutral-600">{cell.renderValue()}</span>
  }),
  columnHelper.accessor("version", {
    header: () => <div>Langue</div>,
    cell: (cell) => <PillVersion version={cell.renderValue() || ""} />
  }),
  columnHelper.accessor("dateShow", {
    header: () => <div>Séance</div>,
    cell: (cell) => {
      const value = cell.renderValue()
      if (!value) return null
      const date = new Date(value)
      const displayedDate = date.toLocaleDateString("fr-FR", {
        weekday: "short",
        month: "2-digit",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      })
      return <span className="text-xs text-neutral-600">{displayedDate}</span>
    }
  }),
  columnHelper.accessor("linkMovie", {
    header: () => <div>Page</div>,
    cell: (cell) => (
      <a
        className="inline-flex items-center gap-1 hover:underline underline-offset-2 text-sm"
        href={cell.renderValue() || ""}
      >
        <LinkIcon className="size-3" />
        <span className="text-sm font-medium">Lien</span>
      </a>
    )
  }),
  columnHelper.accessor("linkShow", {
    header: () => <div>Séance</div>,
    cell: (cell) => (
      <a
        className="inline-flex items-center gap-1 hover:underline underline-offset-2 text-sm"
        href={cell.renderValue() || ""}
      >
        <LinkIcon className="size-3" />
        <span className="text-sm font-medium">Lien</span>
      </a>
    )
  })
]

const Table = ({ data }: { data: Cols[] }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateShow", desc: false }])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

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
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          console.log(row)
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className="p-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table

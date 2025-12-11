import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    isLoading?: boolean
    emptyMessage?: string
    onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    isLoading,
    emptyMessage = "No data found.",
    onRowClick,
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index} className={column.className}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-40 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <FileText className="h-10 w-10 opacity-50" />
                                    <p className="text-sm">{emptyMessage}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                            >
                                {columns.map((column, index) => (
                                    <TableCell key={index} className={column.className}>
                                        {column.cell
                                            ? column.cell(item)
                                            : column.accessorKey
                                                ? (item[column.accessorKey] as React.ReactNode)
                                                : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

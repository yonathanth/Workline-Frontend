"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { Outline } from "../../domain/entities/Outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
    MoreVertical,
    Pencil,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns3,
    ChevronDown,
    Eye,
    Loader2,
    CheckCircle2,
    Clock,
    CircleDashed
} from "lucide-react"
import { CreateOutlineDialog } from "./CreateOutlineDialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface OutlinesTableProps {
    outlines: Outline[]
    isLoading: boolean
    onRowClick?: (outline: Outline) => void
    onDelete?: (outlineId: string) => Promise<void>
}

export function OutlinesTable({ outlines, isLoading, onRowClick, onDelete }: OutlinesTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)
    const [outlineToDelete, setOutlineToDelete] = React.useState<string | null>(null)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const handleDelete = async () => {
        if (outlineToDelete && onDelete) {
            setIsDeleting(true)
            try {
                await onDelete(outlineToDelete)
                setOutlineToDelete(null)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    const handleBulkDelete = async () => {
        if (!onDelete) return

        const selectedRows = table.getFilteredSelectedRowModel().rows
        if (selectedRows.length === 0) return

        setIsDeleting(true)
        try {
            // Delete all selected outlines
            await Promise.all(
                selectedRows.map(row => onDelete(row.original.id))
            )

            // Success feedback
            const { toast } = await import('sonner')
            toast.success(`Successfully deleted ${selectedRows.length} outline${selectedRows.length > 1 ? 's' : ''}`)

            // Clear selection after successful delete
            setRowSelection({})
            setShowBulkDeleteDialog(false)
        } catch (error) {
            const { toast } = await import('sonner')
            toast.error('Failed to delete selected outlines')
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: ColumnDef<Outline>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "header",
            header: "Header",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.header}</div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "sectionType",
            header: "Section Type",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.sectionType.replace(/_/g, ' ')}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                const normalizedStatus = status.toLowerCase()

                const config = {
                    'pending': {
                        label: 'Pending',
                        icon: CircleDashed,
                        className: 'bg-white text-black border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
                    },
                    'in_progress': {
                        label: 'In Progress',
                        icon: Clock,
                        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                    },
                    'completed': {
                        label: 'Completed',
                        icon: CheckCircle2,
                        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                    }
                }

                const statusConfig = config[normalizedStatus as keyof typeof config] || config['pending']
                const Icon = statusConfig.icon

                return (
                    <Badge variant="outline" className={`${statusConfig.className} px-2 py-0.5 gap-1.5`}>
                        <Icon className="h-3.5 w-3.5" />
                        {statusConfig.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "target",
            header: () => <div className="text-right">Target</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Input
                        className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                        defaultValue={row.original.target || ''}
                        readOnly
                    />
                </div>
            ),
        },
        {
            accessorKey: "limit",
            header: () => <div className="text-right">Limit</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Input
                        className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                        defaultValue={row.original.limit || ''}
                        readOnly
                    />
                </div>
            ),
        },
        {
            accessorKey: "reviewer",
            header: "Reviewer",
            cell: ({ row }) => (
                <div className="text-sm whitespace-nowrap">
                    {row.original.reviewer?.name || 'Unassigned'}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => onRowClick?.(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOutlineToDelete(row.original.id)
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const table = useReactTable({
        data: outlines,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

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
        <div className="w-full flex flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">View</Label>

                <div className="flex items-center justify-end gap-2 w-full">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowBulkDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden lg:inline">
                                Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
                            </span>
                            <span className="lg:hidden">
                                Delete ({table.getFilteredSelectedRowModel().rows.length})
                            </span>
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns3 className="h-4 w-4" />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4" />
                        <span className="hidden lg:inline">Add Outline</span>
                    </Button>
                </div>
            </div>
            <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="rounded-lg border overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => onRowClick?.(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No outlines yet. Create your first outline to get started!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">Rows per page</Label>
                            <Select
                                value={`${table.getState().pagination.pageSize} `}
                                onValueChange={(value) => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize} `}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <CreateOutlineDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            <Dialog open={!!outlineToDelete} onOpenChange={(open) => !open && setOutlineToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the outline.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOutlineToDelete(null)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showBulkDeleteDialog} onOpenChange={(open) => !open && setShowBulkDeleteDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Selected Outlines?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {table.getFilteredSelectedRowModel().rows.length} selected outline{table.getFilteredSelectedRowModel().rows.length > 1 ? 's' : ''}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


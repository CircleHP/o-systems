import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    CircularProgress,
} from '@mui/material';

import { formatDate } from '../../utils/formatDate';
import type { ApiResponse, Order } from '../../services/types/api';
import { fetchOrders } from '../../services/api/orders';

const Orders: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('orderDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const { data, isLoading, isFetching } = useQuery<ApiResponse<Order>, Error>({
        queryKey: ['orders', page, rowsPerPage, sortField, sortDirection],
        queryFn: async () =>
            await fetchOrders({
                skip: page * rowsPerPage,
                take: rowsPerPage,
                orderBy: sortDirection === 'asc' ? sortField : undefined,
                orderByDesc: sortDirection === 'desc' ? sortField : undefined,
            }),
    });

    const orders = useMemo(() => data?.results ?? [], [data]);

    const totalFetched = orders.length;
    const hasMoreData = totalFetched === rowsPerPage;

    const columns = useMemo(
        () => [
            { accessorKey: 'id', header: 'Order ID' },
            { accessorKey: 'customerId', header: 'Customer ID' },
            {
                accessorKey: 'orderDate',
                header: 'Order Date',
                cell: (info: any) => formatDate(info.getValue()),
            },
            { accessorKey: 'shipCountry', header: 'Ship Country' },
        ],
        []
    );

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        rowCount: hasMoreData ? page * rowsPerPage + rowsPerPage + 1 : page * rowsPerPage + totalFetched,
        state: { pagination: { pageIndex: page, pageSize: rowsPerPage } },
    });

    return (
        <Paper sx={{ padding: 2 }}>
            <h1>Orders</h1>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        onClick={() => {
                                            setSortField(header.column.id);
                                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableCell>
                                ))
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={page * rowsPerPage + totalFetched}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => {
                    if (hasMoreData || newPage < page) {
                        setPage(newPage);
                    }
                }}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                nextIconButtonProps={{ disabled: !hasMoreData }}
            />

            {isFetching && !isLoading && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <CircularProgress size={24} />
                    <p>Fetching updated data...</p>
                </div>
            )}
        </Paper>
    );
};

export default Orders;

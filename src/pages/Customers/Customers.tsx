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
    TextField,
    TablePagination,
    Paper,
    CircularProgress,
} from '@mui/material';

import type { ApiResponse, Customer } from '../../services/types/api';
import { fetchCustomers } from '../../services/api/customers';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';

const Customers: React.FC = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('companyName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { data, isLoading, isFetching } = useQuery<ApiResponse<Customer>, Error>({
        queryKey: ['customers', search, page, rowsPerPage, sortField, sortDirection],
        queryFn: async () =>
            await fetchCustomers({
                skip: page * rowsPerPage,
                take: rowsPerPage,
                orderBy: sortDirection === 'asc' ? sortField : undefined,
                orderByDesc: sortDirection === 'desc' ? sortField : undefined,
                countryStartsWith: search || undefined,
            }),
    });

    const customers = useMemo(() => data?.results ?? [], [data]);

    // Handle pagination dynamically
    const totalFetched = customers.length;
    const hasMoreData = totalFetched === rowsPerPage;

    const columns = useMemo(
        () => [
            { accessorKey: 'id', header: 'Customer ID' },
            { accessorKey: 'companyName', header: 'Company Name' },
            { accessorKey: 'contactName', header: 'Contact Name' },
            { accessorKey: 'country', header: 'Country' },
            { accessorKey: 'city', header: 'City' },
        ],
        []
    );

    const table = useReactTable({
        data: customers,
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
            <h1>Customers</h1>
            <TextField
                label="Search Customers by Country"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ marginBottom: 2 }}
            />

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
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No customers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => {
                                        setSelectedCustomer(row.original);
                                        setModalOpen(true);
                                    }}
                                    sx={{ cursor: 'pointer' }}
                                >
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

            {/* Customer Details Modal */}
            <CustomerDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} customer={selectedCustomer} />
        </Paper>
    );
};

export default Customers;

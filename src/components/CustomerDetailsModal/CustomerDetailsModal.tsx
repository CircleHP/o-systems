import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Modal,
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from '@mui/material';

import type { CustomerOrder } from '../../services/types/api';
import { formatDate } from '../../utils/formatDate';
import { fetchCustomerOrders } from '../../services/api/customers';

interface CustomerDetailsModalProps {
    open: boolean;
    onClose: () => void;
    customer: {
        id: string;
        companyName: string;
        contactName: string;
        country?: string;
        city?: string;
        phone?: string;
    } | null;
}

const DEFAULT_ORDERS_PER_PAGE = 10;
const ORDERS_SECTION_HEIGHT = 560;

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ open, onClose, customer }) => {
    const [page, setPage] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['customerOrders', customer?.id],
        queryFn: async () => {
            if (!customer?.id) return { results: [] };
            return await fetchCustomerOrders({ customerId: customer.id });
        },
        enabled: !!customer,
    });

    const orders = useMemo(() => data?.results ?? [], [data]);

    const totalRecords = orders.length;

    const paginatedOrders = useMemo(() => {
        const startIndex = page * DEFAULT_ORDERS_PER_PAGE;
        return orders.slice(startIndex, startIndex + DEFAULT_ORDERS_PER_PAGE);
    }, [orders, page]);

    useEffect(() => {
        return () => {
            setPage(0);
        };
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="customer-details-modal">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1200,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                {customer ? (
                    <>
                        <Typography variant="h6" id="customer-details-modal">
                            Customer Details
                        </Typography>
                        <Typography>
                            <strong>Company:</strong> {customer.companyName}
                        </Typography>
                        <Typography>
                            <strong>Contact:</strong> {customer.contactName}
                        </Typography>
                        <Typography>
                            <strong>Location:</strong> {customer.city}, {customer.country}
                        </Typography>
                        <Typography>
                            <strong>Phone:</strong> {customer.phone}
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Orders
                        </Typography>

                        <Box
                            sx={{
                                height: ORDERS_SECTION_HEIGHT,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}
                        >
                            {isLoading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: ORDERS_SECTION_HEIGHT - 50,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : paginatedOrders.length ? (
                                <>
                                    <TableContainer component={Paper} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Order ID</TableCell>
                                                    <TableCell>Order Date</TableCell>
                                                    <TableCell>Ship Name</TableCell>
                                                    <TableCell>Ship City</TableCell>
                                                    <TableCell>Ship Country</TableCell>
                                                    <TableCell>Freight</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedOrders.map((customerOrder: CustomerOrder) => (
                                                    <TableRow key={customerOrder.order.id}>
                                                        <TableCell>{customerOrder.order.id}</TableCell>
                                                        <TableCell>
                                                            {formatDate(customerOrder.order.orderDate)}
                                                        </TableCell>
                                                        <TableCell>{customerOrder.order.shipName}</TableCell>
                                                        <TableCell>{customerOrder.order.shipCity}</TableCell>
                                                        <TableCell>{customerOrder.order.shipCountry}</TableCell>
                                                        <TableCell>
                                                            ${customerOrder.order.freight?.toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Pagination */}
                                    <TablePagination
                                        component="div"
                                        count={totalRecords}
                                        page={page}
                                        rowsPerPage={DEFAULT_ORDERS_PER_PAGE}
                                        onPageChange={(_, newPage) => setPage(newPage)}
                                        rowsPerPageOptions={[]}
                                    />
                                </>
                            ) : (
                                <Typography sx={{ textAlign: 'center', flexGrow: 1 }}>
                                    No orders found for this customer.
                                </Typography>
                            )}
                        </Box>
                    </>
                ) : (
                    <Typography>No customer selected.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default CustomerDetailsModal;

import { useState, useMemo } from 'react';
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

import type { Order } from '../../services/types/api';
import { formatDate } from '../../utils/formatDate';
import { fetchOrders } from '../../services/api/orders';

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
        queryKey: ['allOrders'],
        queryFn: async () => await fetchOrders({ orderBy: 'orderDate', orderByDesc: 'id', take: 1000 }),
        enabled: !!customer,
    });

    const filteredOrders = useMemo(
        () => (customer ? data?.results?.filter((order) => order.customerId === customer.id) ?? [] : []),
        [data, customer]
    );

    const paginatedOrders = useMemo(
        () => filteredOrders.slice(page * DEFAULT_ORDERS_PER_PAGE, (page + 1) * DEFAULT_ORDERS_PER_PAGE),
        [filteredOrders, page]
    );

    const hasMoreData = (page + 1) * DEFAULT_ORDERS_PER_PAGE < filteredOrders.length;

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
                                                    <TableCell>Required Date</TableCell>
                                                    <TableCell>Shipped Date</TableCell>
                                                    <TableCell>Ship Name</TableCell>
                                                    <TableCell>Ship Address</TableCell>
                                                    <TableCell>Ship City</TableCell>
                                                    <TableCell>Ship Country</TableCell>
                                                    <TableCell>Ship Postal Code</TableCell>
                                                    <TableCell>Freight</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedOrders.map((order: Order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>{order.id}</TableCell>
                                                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                                                        <TableCell>{formatDate(order.requiredDate)}</TableCell>
                                                        <TableCell>{formatDate(order.shippedDate)}</TableCell>
                                                        <TableCell>{order.shipName}</TableCell>
                                                        <TableCell>{order.shipAddress}</TableCell>
                                                        <TableCell>{order.shipCity}</TableCell>
                                                        <TableCell>{order.shipCountry}</TableCell>
                                                        <TableCell>{order.shipPostalCode}</TableCell>
                                                        <TableCell>${order.freight?.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Pagination */}
                                    <TablePagination
                                        component="div"
                                        count={filteredOrders.length}
                                        page={page}
                                        rowsPerPage={DEFAULT_ORDERS_PER_PAGE}
                                        onPageChange={(_, newPage) => {
                                            if (hasMoreData || newPage < page) {
                                                setPage(newPage);
                                            }
                                        }}
                                        rowsPerPageOptions={[]}
                                        nextIconButtonProps={{ disabled: !hasMoreData }}
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

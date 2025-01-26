import type { ApiResponse, Customer, CustomerOrder } from '../types/api';

import api from './index';

interface CustomerQueryParams {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderByDesc?: string;
    countryStartsWith?: string;
    fields?: string;
}

export const fetchCustomers = async (params: CustomerQueryParams) => {
    const path = '/query/customers';

    return await api.post<ApiResponse<Customer>>(path, params);
};

interface GetOrdersParams {
    customerId?: string;
    page?: number;
}

interface OrdersResponse extends ApiResponse<CustomerOrder> {
    results: CustomerOrder[];
}

export const fetchCustomerOrders = async (params: GetOrdersParams): Promise<OrdersResponse> => {
    const path = `/customers/${params.customerId}/orders`;

    return await api.get<OrdersResponse>(path);
};

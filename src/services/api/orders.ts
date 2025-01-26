import type { ApiResponse, Order } from '../types/api';

import api from './index';

interface QueryBase {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderByDesc?: string;
    include?: string;
    fields?: string;
    meta?: Record<string, string>;
}

interface QueryOrdersParams extends QueryBase {
    freight?: number;
}

export const fetchOrders = async (params: QueryOrdersParams): Promise<ApiResponse<Order>> => {
    const path = '/query/orders';

    return api.post<ApiResponse<Order>>(path, params);
};

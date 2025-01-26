import type { ApiResponse, Customer } from '../types/api';

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

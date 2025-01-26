import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE = 'https://ec2-34-201-46-215.compute-1.amazonaws.com';

class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }

    /**
     * Generic GET request
     * @param endpoint API endpoint (relative URL)
     * @param config Optional request configuration
     */
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(endpoint, config);
        return response.data;
    }

    /**
     * Generic POST request
     * @param endpoint API endpoint (relative URL)
     * @param data Request body payload
     * @param config Optional request configuration
     */
    async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(endpoint, data, config);
        return response.data;
    }
}

const api = new ApiService(API_BASE);

export default api;

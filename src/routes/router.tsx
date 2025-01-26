import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import ROUTES from '.';
import App from '../App';

const Customers = lazy(() => import('../pages/Customers'));
const Orders = lazy(() => import('../pages/Orders'));

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />}>
            <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route path="*" element={<Navigate to={ROUTES.ORDERS} />} />
        </Route>
    )
);

export default router;

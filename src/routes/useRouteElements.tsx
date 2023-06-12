import { useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import RegisterLayout from '../layouts/RegisterLayout';
import MainLayout from '../layouts/MainLayout';
import ProductList from '../pages/ProductList';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
// import { AppContext } from './contexts/app.context';
import paths from 'src/constants/paths';

const isAuthenticated = false;
function ProtectedRoute() {
    // const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} />;
}

function RejectedRoute() {
    // const { isAuthenticated } = useContext(AppContext);
    return !isAuthenticated ? <Outlet /> : <Navigate to={paths.home} />;
}
const loginAndRegisterRoute = {
    path: '',
    element: <RejectedRoute />,
    children: [
        {
            path: paths.login,
            element: (
                <RegisterLayout>
                    <Login />
                </RegisterLayout>
            )
        },
        {
            path: paths.register,
            element: (
                <RegisterLayout>
                    <Register />
                </RegisterLayout>
            )
        }
    ]
};

const indexRoute = {
    path: '',
    index: true,
    element: (
        <MainLayout>
            <ProductList />
        </MainLayout>
    )
};

const privateRoute = {
    path: '',
    element: <ProtectedRoute />,
    children: [
        {
            path: paths.profile,
            element: (
                <MainLayout>
                    <Profile />
                </MainLayout>
            )
        }
    ]
};

function useRouteElements() {
    const routeElements = useRoutes([loginAndRegisterRoute, privateRoute, indexRoute]);
    return routeElements;
}

export default useRouteElements;

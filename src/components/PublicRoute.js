import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function PublicRoute() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.auth === undefined
            ?
            <Outlet />
            :
            <Navigate to="/home" state={{ from: location }} replace />
    )
}

export default PublicRoute;
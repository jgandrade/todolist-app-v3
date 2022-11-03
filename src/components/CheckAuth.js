import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function CheckAuth() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.auth
            ?
            <Navigate to="/home" state={{ from: location }} replace />
            :
            <Outlet />
    )
}

export default CheckAuth;
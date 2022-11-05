import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SettingsContext from '../context/SettingsProvider';
import useAuth from '../hooks/useAuth';

function PublicRoute() {
    const { auth } = useAuth();
    const { loading } = useContext(SettingsContext);
    const location = useLocation();

    const loader = (
        <img className='position-absolute bottom-50 end-50' style={{ zIndex: 1000 }} srcSet='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt="loading" />
    )

    if (loading) return loader
    
    return (
        auth?.auth === undefined
            ?
            <Outlet />
            :
            <Navigate to="/home" state={{ from: location }} replace />
    )
}

export default PublicRoute;
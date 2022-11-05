import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SettingsContext from '../context/SettingsProvider';
import useAuth from '../hooks/useAuth';

function PublicRoute() {
    const { auth } = useAuth();
    const { loading } = useContext(SettingsContext);
    const location = useLocation();

    const loader = (
        <>
            <div className='w-100 h-100' style={{ zIndex: 999 }}>
                <img className='position-absolute bottom-50 end-50' style={{ zIndex: 1000 }} srcSet='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt="loading" />
            </div>
        </>
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
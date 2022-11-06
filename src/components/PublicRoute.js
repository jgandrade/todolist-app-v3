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
            <div className="position-relative d-flex justify-content-center align-items-center bg-light" style={{ height: "80vh", width: "100vw", zIndex: 2000 }}>
                <img height={70} srcSet='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt="loading" />
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
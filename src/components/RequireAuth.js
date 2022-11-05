import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useContext } from 'react';
import SettingsContext from '../context/SettingsProvider';

function RequireAuth() {
    const { auth } = useAuth();
    const location = useLocation();

    const loader = (
        <>
            <div className="bg-light" style={{ zIndex: 999, height: "100vh", width: "100vw" }}>
                <img className='position-absolute bottom-50 end-50' style={{ zIndex: 1000 }} srcSet='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt="loading" />
            </div>
        </>
    )

    if (loading) return loader

    return (
        auth?.auth !== undefined
            ?
            <Outlet />
            :
            <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth;
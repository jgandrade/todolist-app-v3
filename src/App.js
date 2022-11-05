import { useEffect, useState, Suspense, lazy } from 'react';
import useRefreshToken from "./hooks/useRefreshToken";
import useAuth from './hooks/useAuth';

import { Routes, Route } from 'react-router-dom';
import { FadeLoader } from "react-spinners";
import Swal from 'sweetalert2';

import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SettingsProvider } from './context/SettingsProvider';
import RequireAuth from "./components/RequireAuth";
import PublicRoute from "./components/PublicRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MissingPage = lazy(() => import("./pages/MissingPage"));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const loader = (
    <>
      <div className="bg-light" style={{ zIndex: 999, height: "100vh", width: "100vw" }}>
        <img className='position-absolute bottom-50 end-50' style={{ zIndex: 1000 }} srcSet='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt="loading" />
      </div>
    </>
  )
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const refresh = useRefreshToken();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const isLoggedIn = await refresh();
      setLoading(false);
      if (isLoggedIn === "expired") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Your session has expired!',
          footer: 'You are directed here in the login page.'
        });
        setAuth({});
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Suspense fallback={loader} >
        <SettingsProvider value={{ loading, setLoading }}>
          <div className="position-fixed bottom-50 end-50" style={{ zIndex: 1000 }}>
            <FadeLoader
              color={"#dee333"}
              loading={loading}
              size={100}
            />
          </div>
          <div>
            <Routes>
              {/* PRIVATE ROUTES */}
              <Route element={<RequireAuth />}>
                <Route exact path="/home" element={<HomePage />} />
              </Route>

              {/* PUBLIC ROUTES */}
              <Route element={<PublicRoute />}>
                <Route exact element={<LoginPage />} path="/" />
                <Route exact element={<RegisterPage />} path="/register" />
              </Route>

              <Route path="*" element={<MissingPage />} />
            </Routes>
          </div>
          <Footer />
        </SettingsProvider>
      </Suspense>
    </div>
  );
}

export default App;

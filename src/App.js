import { Suspense, useEffect, useState } from 'react';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MissingPage from "./pages/MissingPage";
import RequireAuth from "./components/RequireAuth";
import PublicRoute from "./components/PublicRoute";
import { Routes, Route } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import useRefreshToken from "./hooks/useRefreshToken";
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import useAuth from './hooks/useAuth';
import Swal from 'sweetalert2';

function App() {
  const { setAuth } = useAuth();
  const loader = (
    <div
      className="position-fixed w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-light"
      style={{ zIndex: 9999 }}
    >
      <h2 className="text-accent fw-bold mt-3">Please wait...</h2>
    </div>
  );

  const refresh = useRefreshToken();

  useEffect(() => {
    (async () => {
      const isLoggedIn = await refresh();
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
  }, []);

  return (
    <div className="App">
      <Suspense fallback={loader}>
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route element={<PublicRoute />}>
            <Route exact element={<LoginPage />} path="/" />
            <Route exact element={<RegisterPage />} path="/register" />
          </Route>

          {/* PRIVATE ROUTES */}
          <Route element={<RequireAuth />}>
            <Route exact path="/home" element={<HomePage />} />
          </Route>

          <Route path="*" element={<MissingPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;

import { Suspense, useEffect } from 'react';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MissingPage from "./pages/MissingPage";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route, Navigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import useRefreshToken from "./hooks/useRefreshToken";
import RegisterPage from './pages/RegisterPage';

function App() {

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
      await refresh();
    })();
  }, []);

  return (
    <div className="App">
      <Suspense fallback={loader}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<LoginPage />} path="/" />
          <Route element={<RegisterPage />} path="/register" />
          {/* PRIVATE ROUTES */}
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

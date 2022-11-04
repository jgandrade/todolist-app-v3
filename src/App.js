import { useEffect, useState } from 'react';
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
import { SettingsProvider } from './context/SettingsProvider';
import { FadeLoader } from "react-spinners";

function App() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <SettingsProvider value={{ loading, setLoading }}>
        <div className="position-absolute bottom-50 end-50">
          <FadeLoader
            color={"#dee333"}
            loading={loading}
            size={100}
          />
        </div>
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
        <Footer />
      </SettingsProvider>
    </div>
  );
}

export default App;

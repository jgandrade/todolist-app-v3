import { useEffect } from 'react';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from './components/Navbar';
import MissingPage from "./pages/MissingPage";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import useRefreshToken from "./hooks/useRefreshToken";
import CheckAuth from './components/CheckAuth';

function App() {
  const refresh = useRefreshToken();

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route element={<CheckAuth />}>
          <Route element={<LoginPage />} path="/" />
        </Route>
        {/* PRIVATE ROUTES */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/nav" element={<Navbar />} />
        </Route>
        <Route path="*" element={<MissingPage />} />
      </Routes>
    </div>
  );
}

export default App;

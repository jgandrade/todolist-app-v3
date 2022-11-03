import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const refresh = async () => {
        const response = await axios.get('/getAccessToken', { withCredentials: true });
        if (response.data.response === false) {
            axios.get("/logout", { withCredentials: true });
            setAuth({});
            return navigate("/");
        } else {
            setAuth(prev => {
                return { ...prev, accessToken: response.data.accessToken, auth: response.data.auth }
            });
            return response.data.accessToken;
        }
    }

    return refresh;
}

export default useRefreshToken;

import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/getAccessToken', { withCredentials: true });
        if (response.data.message === "Token expired") {
            await axios.get("/logout", { withCredentials: true });
            return "expired";
        }

        if (response.data.accessToken !== undefined) {
            setAuth(prev => {
                return { ...prev, accessToken: response.data.accessToken, auth: response.data.auth }
            });
            return response.data.accessToken;
        }

        return "no cookie";
    }

    return refresh;
}

export default useRefreshToken;

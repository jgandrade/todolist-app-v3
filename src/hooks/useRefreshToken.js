import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/getAccessToken', { withCredentials: true });
        if (response.data.response === false) {
            axios.get("/logout", { withCredentials: true });
            setAuth({});
        } else {
            setAuth(prev => {
                return { ...prev, accessToken: response.data.accessToken, auth: response.data.auth }
            });
            return response.data.accessToken;
        }

        return response.data.response;
    }

    return refresh;
}

export default useRefreshToken;

import { useState } from 'react';
import { loginRequest } from '../services/authService';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (user: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginRequest(user, password);

      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return res.data;
      } else {
        setError(res.message.content);
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};

import { AuthResponse } from "@/shared/types/LoginResponse.type";
  
export const loginRequest = async (user: string, password: string): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:4000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
    });

    if (!res.ok) {
        throw new Error('Credenciales inválidas o error del servidor');
    }

    const data = await res.json();
    return data;
};
  
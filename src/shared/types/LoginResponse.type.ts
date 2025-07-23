export interface AuthResponse {
    success: boolean;
    message: {
        type: string;
        content: string;
    };
    data: {
        user_id: string;
        accessToken: string;
        refreshToken: string;
    };
}
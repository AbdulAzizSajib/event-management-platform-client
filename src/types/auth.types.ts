export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        name: string;
        email: string;
        role: string;
        image: string;
    };
}

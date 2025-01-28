export type AuthResponse = {
    code: string;
    token: string;
}

export type GoogleUser = {
    firtstName?: string;
    lastName? : string;
    email: string;
    avatar?: string;
    accessToken?: string;
}
interface User {
    email: string;
    key: string;
    secret: string;
    data?: any;
    lastTokenGeneratedAt?: string;
}
export declare const GetAccessToken: (email: string, authcode: string) => Promise<User | void>;
export {};

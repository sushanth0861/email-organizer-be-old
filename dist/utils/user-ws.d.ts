type UserData = {
    socketId: string;
    userId: string | undefined;
    email: string | null | undefined;
};
export declare const addUser: (user: UserData) => void;
export declare const removeUser: (socketId: string) => void;
export declare const getUserById: (userId: string | undefined) => UserData | undefined;
export declare const getUserBySocketId: (socketId: string) => UserData | undefined;
export declare const getAllUsers: () => UserData[];
export {};

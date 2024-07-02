type UserData = {
    socketId: string;
    userId: string | undefined;
    email: string | null | undefined;
  };

let connectedUsers: UserData[] = [];

export const addUser = (user: UserData) => {
  connectedUsers.push(user);
};
  
export const removeUser = (socketId: string) => {
  connectedUsers = connectedUsers.filter((user) => user.socketId !== socketId);
};

export const getUserById = (
  userId: string | undefined
): UserData | undefined => {
  return connectedUsers.find((user) => user.userId === userId);
};

export const getUserBySocketId = (socketId: string): UserData | undefined => {
  return connectedUsers.find((user) => user.socketId === socketId);
};

export const getAllUsers = (): UserData[] => {
  return connectedUsers;
};

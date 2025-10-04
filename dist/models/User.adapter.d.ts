import { CreateUserDto, User } from "../types";
export declare class UserModelAdapter {
    private toUser;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    createUser(userData: CreateUserDto): Promise<User>;
    authenticateUser(email: string, password: string): Promise<User | null>;
    updateUser(id: string, updates: Partial<User>): Promise<User | null>;
    changePassword(id: string, newPassword: string): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getUserCount(): Promise<number>;
    sanitizeUser(user: User): Omit<User, "password">;
}
export declare const userModel: UserModelAdapter;
//# sourceMappingURL=User.adapter.d.ts.map
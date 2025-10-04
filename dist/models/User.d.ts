import { CreateUserDto, User } from "../types";
declare class UserRepository {
    private users;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: CreateUserDto): Promise<User>;
    update(id: string, updates: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<User[]>;
    count(): Promise<number>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    clear(): Promise<void>;
}
export declare const userRepository: UserRepository;
export declare class UserModel {
    private repository;
    constructor(repository: UserRepository);
    createUser(userData: CreateUserDto): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    authenticateUser(email: string, password: string): Promise<User | null>;
    updateUser(id: string, updates: Partial<User>): Promise<User | null>;
    changePassword(id: string, newPassword: string): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getUserCount(): Promise<number>;
    sanitizeUser(user: User): Omit<User, "password">;
}
export declare const userModel: UserModel;
export {};
//# sourceMappingURL=User.d.ts.map
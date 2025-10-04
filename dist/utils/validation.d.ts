import Joi from "joi";
import { CreateUserDto, LoginDto } from "../types";
export declare const loginSchema: Joi.ObjectSchema<LoginDto>;
export declare const createUserSchema: Joi.ObjectSchema<CreateUserDto>;
export declare const createBlogSchema: Joi.ObjectSchema<any>;
export declare const updateBlogSchema: Joi.ObjectSchema<any>;
export declare const createProjectSchema: Joi.ObjectSchema<any>;
export declare const validateInput: <T>(schema: Joi.ObjectSchema<T>, data: unknown) => T;
//# sourceMappingURL=validation.d.ts.map
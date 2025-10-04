"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = exports.createProjectSchema = exports.updateBlogSchema = exports.createBlogSchema = exports.createUserSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu", "dev", "io"] },
    })
        .required()
        .messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
});
exports.createUserSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu", "dev", "io"] },
    })
        .required()
        .messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .min(6)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
        .required()
        .messages({
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, and one number",
        "any.required": "Password is required",
    }),
    role: joi_1.default.string().valid("admin").optional(),
});
exports.createBlogSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(200).required().messages({
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 200 characters",
        "any.required": "Title is required",
    }),
    content: joi_1.default.string().min(10).required().messages({
        "string.min": "Content must be at least 10 characters long",
        "any.required": "Content is required",
    }),
    excerpt: joi_1.default.string().max(500).optional().messages({
        "string.max": "Excerpt cannot exceed 500 characters",
    }),
    published: joi_1.default.boolean().optional().default(false),
});
exports.updateBlogSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().min(3).max(200).optional(),
    content: joi_1.default.string().min(10).optional(),
    excerpt: joi_1.default.string().max(500).optional(),
    published: joi_1.default.boolean().optional(),
});
exports.createProjectSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(200).required(),
    description: joi_1.default.string().min(10).max(1000).required(),
    content: joi_1.default.string().optional(),
    thumbnail: joi_1.default.string().uri().optional(),
    projectUrl: joi_1.default.string().uri().optional(),
    githubUrl: joi_1.default.string().uri().optional(),
    technologies: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
    featured: joi_1.default.boolean().optional().default(false),
    published: joi_1.default.boolean().optional().default(false),
});
const validateInput = (schema, data) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(", ");
        throw new Error(errorMessage);
    }
    return value;
};
exports.validateInput = validateInput;
//# sourceMappingURL=validation.js.map
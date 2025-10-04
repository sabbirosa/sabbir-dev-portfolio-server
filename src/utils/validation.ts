import Joi from "joi";
import { CreateUserDto, LoginDto } from "../types";

// Validation schemas
export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "dev", "io"] },
    })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export const createUserSchema = Joi.object<CreateUserDto>({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "dev", "io"] },
    })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "any.required": "Password is required",
    }),
  role: Joi.string().valid("admin").optional(),
});

// Blog validation schemas (for future use)
export const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(10).required().messages({
    "string.min": "Content must be at least 10 characters long",
    "any.required": "Content is required",
  }),
  excerpt: Joi.string().max(500).optional().messages({
    "string.max": "Excerpt cannot exceed 500 characters",
  }),
  published: Joi.boolean().optional().default(false),
});

export const updateBlogSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(10).optional(),
  excerpt: Joi.string().max(500).optional(),
  published: Joi.boolean().optional(),
});

// Project validation schemas (for future use)
export const createProjectSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(1000).required(),
  content: Joi.string().optional(),
  thumbnail: Joi.string().uri().optional(),
  projectUrl: Joi.string().uri().optional(),
  githubUrl: Joi.string().uri().optional(),
  technologies: Joi.array().items(Joi.string()).min(1).required(),
  featured: Joi.boolean().optional().default(false),
  published: Joi.boolean().optional().default(false),
});

// Generic validation function
export const validateInput = <T>(
  schema: Joi.ObjectSchema<T>,
  data: unknown
): T => {
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

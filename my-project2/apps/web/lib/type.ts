import { z } from "zod";

export type FormState =
  | {
      error?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
        birthdate?: string[];
        gender?: string[];
        university?: string[];
        userType?: string[];
        formation?: string[];
        graduationYear?: string[];
        degree?: string[];
        occupation?: string[];
        subject?: string[];
        rank?: string[];
        interests?: string[];
      };
      message?: string;
    }
  | undefined;

export const SignupFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .trim(),
    
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .trim(),
    

  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .trim(),
    
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." })
    .trim(),

  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits long." })
    .trim(),
    
  birthdate: z
    .string()
    .min(1, { message: "Birthdate is required. " })
    .trim()
    .date(),
    

  gender: z
    .enum(["male", "female"], { message: "Select a valid gender." }),
    
  university: z
    .string()
    .min(1, { message: "University is required." })
    .trim(),
    
  userType: z
    .enum(["student", "alumni", "professor"], { message: "Select a valid user type." })
    .refine(val => val.length > 0, { message: "User type is required." }),

  formation: z
    .string()
    .min(1, { message: "Formation must have at least one character." })
    .optional(),
    
  graduationYear: z
    .string()
    .min(1, { message: "Graduation year must have at least one character." })
    .optional(),
    

  degree: z
    .string()
    .min(1, { message: "Degree must have at least one character." })
    .optional()
    ,

  occupation: z
    .string()
    .min(1, { message: "Occupation must have at least one character." })
    .optional(),
    

  subject: z
    .string()
    .min(1, { message: "Subject must have at least one character." })
    .optional()
    ,

  rank: z
    .string()
    .min(1, { message: "Rank must have at least one character." })
    .optional()
    ,

  interests: z
    .array(z.string())
    .min(1, { message: "At least one interest must be selected." })
    .optional()
    ,
});

export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
}

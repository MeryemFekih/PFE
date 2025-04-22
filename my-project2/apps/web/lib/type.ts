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
    .optional()
    .nullable(),
    
  graduationYear: z
    .string()
    .min(1, { message: "Graduation year must have at least one character." })
    .date()
    .optional()
    .nullable(),
    

  degree: z
    .string()
    .min(1, { message: "Degree must have at least one character." })
    .optional()
    .nullable(),

  occupation: z
    .string()
    .min(1, { message: "Occupation must have at least one character." })
    .optional()
    .nullable(),
    

  subject: z
    .string()
    .min(1, { message: "Subject must have at least one character." })
    .optional()
    .nullable(),

  rank: z
    .enum(["assistant", "associate", "full","lecturer"], { message: "Select a valid rank." })
    .refine(val => val.length > 0, { message: "Rank is required." })
    .nullable(),

  interests: z
    .array(z.string())
    .min(0, { message: "At least one interest must be selected." })
    .optional()
    .nullable(),
});
export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(1, {
      message: "Password field must not be empty.",
    }),
});

export enum Role {
  ADMIN = "ADMIN",
  ALUMNI = "ALUMNI",
  PROFESSOR = "PROFESSOR",
  STUDENT = "STUDENT",
  USER ="USER"
}

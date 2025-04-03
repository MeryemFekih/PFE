"use server"

import { FormState, SignupFormSchema } from "./type";
import { BACKEND_URL } from "./constants";
import { redirect } from "next/navigation";


export async function signUp (state: FormState ,formData:FormData): Promise<FormState> {
    
    const validationFields = SignupFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone : formData.get("phone"),
        birthdate: formData.get("birthdate"),
        gender: formData.get("gender"),
        university: formData.get("university"),
        userType: formData.get("userType"),
        formation: formData.get("formation"),
        graduationYear: formData.get("graduationYear"),
        degree: formData.get("degree"),
        occupation: formData.get("occupation"),
        subject: formData.get("subject"),
        rank: formData.get("rank"),
        interests: JSON.parse(formData.get("interests") as string || '[]')
        });

    if (!validationFields.success) {
        return {
          error: validationFields.error.flatten().fieldErrors,
        };
      }
      const response = await fetch(
        `${BACKEND_URL}/auth/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validationFields.data),
        }
      );
      if (response.ok) {
        redirect("/auth/signIn");
      } else
        return {
          message:
            response.status === 409
              ? "The user  already existed!"
              : response.statusText,
        };
    }
      

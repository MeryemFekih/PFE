"use server";

import { FormState, SignupFormSchema } from "./type";
import { BACKEND_URL } from "./constants";
import { redirect } from "next/navigation";

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string ,
      birthdate: formData.get("birthdate") as string,
      gender: formData.get("gender") as string,
      university: formData.get("university") as string ,
      userType: formData.get("userType") as string,
      formation: formData.get("formation") as string || null ,
      graduationYear: formData.get("graduationYear") as string || null  ,
      degree: formData.get("degree") as string || null,
      occupation: formData.get("occupation") as string || null,
      subject: formData.get("subject") as string || null,
      rank: formData.get("rank") ? Number(formData.get("rank")) : null ,
      interests: JSON.parse((formData.get("interests") as string) || '[]')
    };
    console.log("this the data", rawData);

    // Validate data
    const validation = SignupFormSchema.safeParse(rawData);
    console.log("this the validation:",validation);
    if (!validation.success) {
      return {
        error: validation.error.flatten().fieldErrors,
      };

    }
  
    
    

    // Prepare the request body with proper dates
    const requestBody = {
      ...validation.data,
      birthdate: new Date(validation.data.birthdate).toISOString(),
      graduationYear: validation.data.graduationYear 
        ? new Date(validation.data.graduationYear).toISOString() 
        : null
    };

    // Send to backend
    const response = await fetch(`${BACKEND_URL}/auth/signup`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        message: errorData?.message || 
               (response.status === 409 
                 ? "The user already exists!" 
                 : "An error occurred during signup") 
      };
    }

    // Only redirect after successful submission
    return redirect("/auth/signIn");

  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred. Please try again."
    };
  }
}
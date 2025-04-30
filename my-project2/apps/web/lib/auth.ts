"use server";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { BACKEND_URL } from "./constants";
import { redirect } from "next/navigation";
import { createSession } from "./session";

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      birthdate: formData.get("birthdate") as string,
      gender: formData.get("gender") as string,
      university: formData.get("university") as string,
      userType: formData.get("userType") as string,
      formation: formData.get("formation") as string || null,
      graduationYear: formData.get("graduationYear") as string || null,
      degree: formData.get("degree") as string || null,
      occupation: formData.get("occupation") as string || null,
      subject: formData.get("subject") as string || null,
      rank: formData.get("rank") as string || null,
      interests: JSON.parse((formData.get("interests") as string) || '[]')
    };
    console.log("this the data", rawData);

    // Validate data
    const validation = SignupFormSchema.safeParse(rawData);
    console.log("this the validation:", validation);
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
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      redirect("/auth/signIn"); // This will throw a NEXT_REDIRECT
      return {}; // This line won't be reached
    } else {
      return {
        message: response.status === 409
          ? "The user already exists!" 
          : "An error occurred during signup"
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; // Let Next.js handle the redirect
    }
    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred. Please try again."
    };
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName")
    });
    
    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      };
    }
  
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });
  
    if (response.ok) {
      const result = await response.json();
      await createSession({
        user: {
          firstName: result.firstName,
          id: result.id,
          email: result.email,
          role : result.role,
        },
        accessToken:result.accessToken,
        refreshToken: result.refreshToken,
      });
      
      // Redirect ONLY on successful authentication
      redirect("/");
      // No return needed after redirect - it throws internally
    } else {
      return {
        message: response.status === 401
          ? "Invalid Credentials!"
          : response.statusText,
      };
    }
  } catch (error) {
    // Special handling for redirect errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; // Let Next.js handle the redirect
    }
    
    console.error("Signin error:", error);
    return {
      message: "An unexpected error occurred. Please try again."
    };
  }
}

export const refreshToken = async (
  oldRefreshToken: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: oldRefreshToken,
        }),
      }
    );

    if (!response.ok) {
      return "hello";
    }

    const { accessToken, refreshToken } =
      await response.json();
    // update session with new tokens
    const updateRes = await fetch(
      "http://localhost:3000/api/auth/update",
      {
        method: "POST",
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      }
    );
    if (!updateRes.ok)
      throw new Error("Failed to update the tokens");

    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};
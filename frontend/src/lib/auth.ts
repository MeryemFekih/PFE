"use server";

import { FormState, LoginFormSchema, SignupFormSchema } from "@/lib/schemas";
import { BACKEND_URL } from "./constants";
import { redirect } from "next/navigation";
import { createSession } from "./session";
import { revalidatePath } from "next/cache";
import z from "zod";

type Inputs = z.infer<typeof SignupFormSchema>;

export async function signUp(data: Inputs): Promise<FormState> {
  try {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' && value.trim() === '') return [key, null];
        return [key, value];
      })
    );
    const validation = SignupFormSchema.safeParse(cleanedData);
    console.log("Validation result:", validation);
    if (!validation.success) {
      console.log("Validation errors:", validation.error.flatten());
      return {
        error: validation.error.flatten().fieldErrors,
      };
    }

    const requestBody = {
      ...validation.data,
      birthdate: new Date(validation.data.birthdate).toISOString(),
      graduationYear: validation.data.graduationYear
        ? new Date(validation.data.graduationYear).toISOString()
        : null,
    };

    console.log("Final signup payload:", requestBody);

    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      redirect("/auth/signIn");
    } else {
      const errorText = await response.text();
      console.error("Signup failed:", response.status, errorText);
      return {
        message:
          response.status === 409
            ? "The user already exists!"
            : `Signup failed with status ${response.status}: ${errorText}`,
      };
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
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
      password: formData.get("password") as string,
      firstName: formData.get("firstName"),
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
      console.log("✅ Backend response:", result); // 👈 check this!

      await createSession({
        user: {
          firstName: result.firstName,
          lastName: result.lastName,
          id: result.id,
          email: result.email,
          role: result.role,
          interests: result.interests,
          university: result.university,
          formation: result.formation,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      redirect('/profile');
    } else {
      return {
        message: response.status === 401
          ? "Invalid Credentials!"
          : response.statusText,
      };
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Signin error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function resetPassword(
  email: string,
  resetCode: string,
  newPassword: string
): Promise<FormState> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resetCode, newPassword }),
    });

    const result = await response.json();

    if (result.message?.includes("success")) {
      redirect('/auth/signIn');
    }

    return {
      message: result.message || 'Error during reset',
    };
  } catch (err) {
    console.error("Reset error:", err);
    return { message: 'Unexpected error. Please try again.' };
  }
}

export async function forgotPassword(email: string): Promise<FormState> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    return { message: result.message };
  } catch (err) {
    console.error("Forgot password error:", err);
    return { message: 'Failed to send reset email.' };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: oldRefreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token: " + response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();

    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (!updateRes.ok)
      throw new Error("Failed to update the tokens");

    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};

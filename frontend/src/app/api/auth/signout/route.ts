import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";


export async function GET() {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) {
    await deleteSession();
    revalidatePath('/') // Revalidate the root path
    redirect('/') //
  }
  

  redirect("/", RedirectType.push);
}
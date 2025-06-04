import { getSession } from "@/lib/session";
import LandingPage from "./home/home";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  console.log("session", session);
  if (session) {
    // Session is active (e.g., user opened the app after a day)
    redirect("/profile");
  }
  return (
    <div>
      <LandingPage/>
    </div>
  );
}

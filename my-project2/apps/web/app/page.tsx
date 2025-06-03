import { getSession } from "@/lib/session";
import LandingPage from "./home/home";

export default async function Home() {
  const session = await getSession();
  console.log("session", session);
  return (
    <div>
      <LandingPage/>
    </div>
  );
}

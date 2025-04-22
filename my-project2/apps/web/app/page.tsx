import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  console.log("session", session);
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

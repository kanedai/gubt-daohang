import HomeClient from "@/components/home/home-client";
import { getCategories } from "@/lib/data";
import { cookies } from "next/headers";

// This is a Server Component
export default async function Page() {
  const data = await getCategories();
  const session = (await cookies()).get("admin_session")?.value === "true";
  return <HomeClient initialData={data} isAdmin={!!session} />;
}

import HomeClient from "@/components/home/home-client";
import { getCategories } from "@/lib/data";

// This is a Server Component
export default async function Page() {
  const data = await getCategories();
  return <HomeClient initialData={data} />;
}

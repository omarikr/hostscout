import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { AdminPanel } from "@/components/AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session || !session.isAdmin) {
    redirect("/");
  }

  return <AdminPanel />;
}
